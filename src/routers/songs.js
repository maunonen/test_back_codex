const express = require('express');
const songsRouter = new express.Router();
const {isValidUUID} = require('../utils/helper');
const {Song, Author} = require('../../models/');
const {Op} = require("sequelize");
const moment = require('moment');

// find by id
songsRouter.get('/:uuid', async (req, res) => {
    const uuid = req.params.uuid
    try {
        isValidUUID(uuid, res);
        const songById = await Song.findOne({
            where: {uuid}
        });
        if (songById) {
            return res.status(200).json(songById);
        } else {
            return res.status(404).json({error: 'Nothing found'});
        }
    } catch (err) {
        console.log('Something went wrong', err);
        return res.status(500).json({error: 'Something went wrong'});
    }
})

songsRouter.get('/', async (req, res) => {
    /* Получить все песни определенного исполнителя или нескольких исполнителей.*/
    /* Получить выборку песен или исполнителей по части их названия.*/
    /* Получить выборку песен или исполнителей по дате внесения записи.*/
    /* Получить часть выборки песен или исполнителей. Например,
        10 песен, идущих после первых 20-и от начала выборки.
    */
    /**
     * songTitle - search params songs title
     * createdAtSong - Date params for searching author
     * */

    const {
        songTitle, authorName, limit,
        offset, createdAtSong, authorList
    } = req.query;

    try {
        const queryParams = {
            where: {
                ...(songTitle !== undefined && {
                    title: {[Op.like]: `%${songTitle}%`}
                }),
                ...(createdAtSong !== undefined && {
                    createdAt: {
                        [Op.gte]: moment(createdAtSong).toDate(),
                        [Op.lt]: moment(createdAtSong).add(1, 'days').toDate(),
                    }
                })
            },
            ...((offset !== undefined && offset !== null) && {offset}),
            ...((limit !== undefined && limit !== null) && {limit}),
            include: {
                model: Author,
                as: 'author',
                attributes: ['uuid', 'name', 'label'],
                where: {
                    ...(authorName !== undefined && {
                            name: {[Op.like]: `%${authorName}%`}
                        }
                    ),
                    ...((authorList && authorList.length > 0) && {
                        uuid: {[Op.or]: [...authorList]}
                    }),
                }
            },
        }


        const allSongs = await Song.findAll(queryParams);
        return res.json(allSongs);
    } catch (err) {
        console.log('Something went wrong', err);
        return res.status(500).json({error: 'Something went wrong'});
    }
})


songsRouter.post('/', async (req, res) => {
    const {title, duration, authorUuid} = req.body;
    try {
        isValidUUID(authorUuid, res);
        const authorObject = await Author.findOne({where: {uuid: authorUuid}})
        if (authorObject) {
            const newSong = await Song.create({title, duration, authorId: authorObject.id});
            return res.status(201).json(newSong);
        } else {
            return res.status(404).json({error: "Author not found"});
        }
    } catch (err) {
        console.log("Something went wrong", err);
        return res.status(500).json({error: 'Something went wrong'});
    }
})

songsRouter.delete('/:uuid', async (req, res) => {
    const uuid = req.params.uuid
    try {
        const songToRemoved = await Song.findOne({where: {uuid}});
        if (songToRemoved) {
            await songToRemoved.destroy();
            return res.status(200).json({message: 'Song deleted'});
        } else {
            return res.status(404).json({error: 'Nothing to delete'});
        }
    } catch (err) {
        console.log("Something went wrong", err);
        return res.status(500).json({error: 'Something went wrong'});
        ;
    }
})

songsRouter.put('/:uuid', async (req, res) => {
    const uuid = req.params.uuid
    const {title, duration, authorUuid} = req.body
    /*let authorId;*/
    try {
        // validate UUid of Songs and author if provided
        isValidUUID(uuid, res);
        isValidUUID(authorUuid, res);

        const authorObject = await Author.findOne({where: {uuid: authorUuid}})
        if (!authorObject) {
            return res.status(404).json({error: 'Can not update author. Author not found'});
        }

        const updatedSong = await Song.findOne({where: {uuid}});

        if (!updatedSong) {
            return res.status(404).json({error: 'Song not found'});
        }

        if (title !== undefined) {
            updatedSong.title = title
        }
        if (duration !== undefined) {
            updatedSong.duration = duration
        }
        if (authorObject.id !== undefined) {
            updatedSong.authorId = authorObject.id
        }
        await updatedSong.save();
        return res.status(200).json(updatedSong)
    } catch (err) {
        console.log('Something went wrong', err);
        return res.status(500).json({error: 'Something went wrong'});
    }
})

module.exports = songsRouter