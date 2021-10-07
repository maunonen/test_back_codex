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
        uuid && isValidUUID(uuid, res);
        const songById = await Song.findOne({
            where: {uuid}
        });
        if (songById) {
            return res.status(200).json(songById);
        } else {
            return res.status(404).json({message: 'Nothing found'});
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
    /*const {
        songTitle, authorName, limit,
        offset, createdAtSong, authorList
    } = req.body;*/
    const {
        songTitle, authorName, limit,
        offset, createdAtSong, authorList
    } = req.query;

    /*console.log('Params', req.params);
    console.log('Query', req.query);*/

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
        if (!authorUuid) {
            return res.status(400).json({error: "Please provide Author uuid"});
        }
        authorUuid && isValidUUID(authorUuid, res);
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
            return res.status(404).json({message: 'Nothing to delete'});
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
    let authorId;
    try {
        // validate UUid of Songs and author if provided
        uuid && isValidUUID(uuid, res);
        // Check if Author exist
        if (authorUuid && isValidUUID(authorUuid, res)) {
            const authorObject = await Author.findOne({where: {uuid: authorUuid}})
            console.log('Author object', authorObject);
            if (!authorObject) {
                return res.status(400).json({message: 'Can not update author. Author not found'});
            } else {
                authorId = authorObject.id
            }
        }

        // values to be updated
        /*const updatedValues = {
            ...(title !== undefined && {title}),
            ...(duration !== undefined && {duration}),
            ...(authorId !== undefined && {authorId}),
        }

        console.log('UPDATED', updatedValues);

        const updatedObject = await Song.update(updatedValues, {
            where: {uuid},
            returning: true,
            plain: true
        });
        console.log("UPDATED OBJECT", updatedObject);
        return res.status(200).json({
            message : "Song was successfully updated"
        })*/

        /*if (updatedObject.length > 0) {

        } else {
            return res.status(400).json({
                message : "Nothing to update"
            })
        }*/
        const updatedSong = await Song.findOne({where: {uuid}});
        console.log('Before update', updatedSong)

        if (!updatedSong) {
            return res.status(404).json({message: 'Song not found'});
        }

        if (title !== undefined) {
            updatedSong.title = title
        }
        if (duration !== undefined) {
            updatedSong.duration = duration
        }
        if (authorId !== undefined) {
            console.log('Author ID', authorId);
            updatedSong.authorId = authorId
        }
        console.log('Before save', updatedSong)
        await updatedSong.save();
        return res.status(200).json(updatedSong)
    } catch (err) {
        console.log('Something went wrong', err);
        return res.status(500).json({error: 'Something went wrong'});
    }
})

module.exports = songsRouter