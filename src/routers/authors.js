const express = require('express');
const authorRouter = new express.Router();
const {Author, Song} = require('../../models/');
const {isAllowedAuthor, isValidUUID} = require('../utils/helper');
const validator = require('validator');
const moment = require('moment');
const {Op} = require("sequelize");

// get Author by ID
/* Получить все песни определенного исполнителя или нескольких исполнителей.*/
authorRouter.get('/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    try {
        isValidUUID(uuid, res);
        const authorById = await Author.findOne({
            where: {uuid},
            include: 'songs',
        });
        if (authorById) {
            return res.status(200).json(authorById);
        } else {
            return res.status(404).json({error: 'Nothing found'});
        }
    } catch (err) {
        console.log('Something went wrong', err);
        return res.status(500).json({error: 'Something went wrong'});
    }
})

authorRouter.get('/', async (req, res) => {
    /* Получить все песни определенного исполнителя или нескольких исполнителей.*/
    /* Получить выборку песен или исполнителей по части их названия.*/
    /* Получить выборку песен или исполнителей по дате внесения записи.*/
    /* Получить часть выборки песен или исполнителей. Например,
        10 песен, идущих после первых 20-и от начала выборки.
    */
    /**
     * authorsList - array of Author userID
     * authorName - searching string by Author name
     * createdAtAuthor - Date params for searching author
     */
    const {
        authorList, authorName, songTitle,
        createdAtAuthor, limit, offset
    } = req.query;

    try {
        /**
         * creating query params object querying by author uuid, author name,
         * created date. Setting up offset and limit. Connect Author model.
         * */
        const searchingParams = {
            where: {
                ...(authorList && authorList.length && {
                    uuid: {[Op.or]: [...authorList]}
                })
                ,
                ...(authorName !== undefined && {
                    name: {[Op.like]: `%${authorName}%`}
                })
                ,
                ...(createdAtAuthor !== undefined && {
                    createdAt: {
                        [Op.gte]: moment(createdAtAuthor).toDate(),
                        [Op.lt]: moment(createdAtAuthor).add(1, 'days').toDate(),
                    }
                })
            },
            ...((offset !== undefined && offset !== null) && {offset}),
            ...((limit !== undefined && limit !== null) && {limit}),
            include: {
                model: Song,
                as: 'songs',
                attributes: ['uuid', 'title', 'duration'],
                ...(songTitle !== undefined && {
                    where: {
                        title: {[Op.like]: `%${songTitle}%`}
                    }
                }),
            },
        }

        const authorResult = await Author.findAll(
            searchingParams,
        );
        if (!authorResult) {
            return res.status(404).json({
                message: "Nothing found"
            })
        } else {
            return res.status(200).json(authorResult);
        }

    } catch (err) {
        console.log('Something went wrong', err);
        return res.status(500).json({error: 'Something went wrong'});
    }
})



authorRouter.post('/', async (req, res) => {
    let {name, birthday, label} = req.body;
    try {
        if (!isAllowedAuthor(name.trim())) {
            return res.status(400).send({error: "Author is not allowed"});
        }
        const newAuthor = await Author.create({name, birthday, label});
        res.status(201).send(newAuthor);
    } catch (e) {
        res.status(500).send({error: e.message || e});
    }
})


authorRouter.put('/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    const {name, birthday, label} = req.body;
    try {
        isValidUUID(uuid, res);
        const updatedAuthor = await Author.findOne({
            where: {uuid}
        })
        if (!updatedAuthor) {
            return res.status(404).json({error: 'Author not found'});
        }
        if (name !== undefined) {
            updatedAuthor.name = name;
        }
        if (birthday !== undefined) {
            updatedAuthor.birthday = birthday;
        }
        if (label !== undefined) {
            updatedAuthor.label = label;
        }
        await updatedAuthor.save();
        return res.status(200).json(updatedAuthor);
    } catch (err) {
        res.send(err);
    }
})

authorRouter.delete('/:uuid', async (req, res) => {
    const uuid = req.params.uuid
    try {
        isValidUUID(uuid, res);
        const authorToRemoved = await Author.findOne({
            where: {uuid}
        })
        if (authorToRemoved) {
            await authorToRemoved.destroy();
            return res.status(200).json({message: 'Author and his songs have been deleted'});
        } else {
            return res.status(404).json({error: 'Author not found'});
        }
    } catch (err) {
        res.send(err);
    }
})

module.exports = authorRouter