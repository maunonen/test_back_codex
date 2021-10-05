const express = require('express');
const authorRouter = new express.Router();
const {Author} = require('../../models/');
const {isAllowedAuthor, isValidUUID} = require('../utils/helper');
const validator = require('validator');

// get Author by ID
authorRouter.get('/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    try {
        uuid && isValidUUID(uuid, res);
        const authorById = await Author.findOne({
            where: {uuid},
            include: 'songs',
        });
        if (authorById) {
            return res.status(200).json(authorById);
        } else {
            return res.status(404).json({message: 'Nothing found'});
        }
    } catch (err) {
        console.log('Something went wrong', err);
        return res.status(500).json({error: 'Something went wrong'});
    }
})

authorRouter.get('/', async (req, res) => {
    try {
        const authorList = await Author.findAll();
        if (!authorList) {
            return res.status(404).json({
                message: "Nothing found"
            })
        } else {
            return res.status(200).json(authorList);
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
            return res.status(400).json({error: "Author is not allowed"});
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
    console.log(uuid);
    try {
        uuid && isValidUUID(uuid, res);
        const updatedAuthor = await Author.findOne({
            where: {uuid}
        })
        if (!updatedAuthor) {
            return res.status(404).json({message: 'Author not found'});
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
        uuid && isValidUUID(uuid, res);
        const authorToRemoved = await Author.findOne({
            where: {uuid}
        })
        if (authorToRemoved) {
            await authorToRemoved.destroy();
            return res.status(200).json({message: 'Author and his songs have been deleted'});
        } else {
            return res.status(404).json({message: 'Author not found'});
        }
    } catch (err) {
        res.send(err);
    }
})

module.exports = authorRouter