const express = require('express');
const songsRouter = new express.Router();
const validator = require('validator');
const {Song, Author} = require('../../models/');


/* Получить все песни определенного исполнителя или нескольких исполнителей.*/
/* Получить выборку песен или исполнителей по части их названия.*/
/* Получить выборку песен или исполнителей по дате внесения записи.*/
/* Получить часть выборки песен или исполнителей. Например,
    10 песен, идущих после первых 20-и от начала выборки.
*/

// find by id
songsRouter.get('/:uuid', async (req, res) => {
    const uuid = req.params.uuid
    try {
        isValidUUID(uuid, res);
        const songById = await Song.findOne({
            where: {uuid}
        });
        return res.json(songById);
    } catch (err) {
        console.log('Something went wrong', err);
        return res.status(500).json({error: 'Something went wrong'});
    }
})

// Получить все песни определенного исполнителя или нескольких исполнителей

songsRouter.get('/', async (req, res) => {
    try {
        /*const allSongs = await Song.findAll({include: {model: Author, as: 'author'}});*/
        const allSongs = await Song.findAll({include: 'author'});
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
        return res.status(500)
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
        res.send('Update Songs query');
    } catch (err) {
        res.send(err);
    }
})

songsRouter.put('/:uuid', async (req, res) => {
    const uuid = req.params.uuid
    const {title, duration, authorUuid} = req.body
    let authorId;
    try {
        // validate UUid of Songs and author if provided
        isValidUUID(uuid, res);
        // validate in case of author authorUuid is provided

        // Check if Author exist
        if (authorUuid && isValidUUID(authorUuid, res)) {
            const authorObject = await Author.findOne({where: {uuid: authorUuid}})
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

        if (!updatedSong) {
            return res.status(404).json({message: 'Song not found'});
        }

        if (title !== undefined) {
            updatedSong.title = title
        }
        if (duration !== undefined) {
            updatedSong.duration = duration
        }
        if ( authorId !== undefined) {
            updatedSong.authorId = authorId
        }

        await updatedSong.save();
        return res.status(200).json({
            message: "Song was successfully updated"
        })
    } catch (err) {
        console.log('Something went wrong', err);
        return res.status(500).json({error: 'Something went wrong'});
    }
})

function isValidUUID(uuid, res) {
    if (!validator.isUUID(uuid, [4])) {
        return res.status(400).json({error: "Invalid request (UUID not valid)"});
    }
    return true
}

module.exports = songsRouter