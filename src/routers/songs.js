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
        if (!validator.isUUID(uuid, [4])) {
            return res.status(400).json({error: "Invalid request (UUID not valid)"});
        }
        const songById = await Song.findOne({where: {uuid}});
        return res.json(songById);
    } catch (err) {
        console.log('Something went wrong', err);
        return res.status(500).json({error: 'Something went wrong'});
    }
})

// find all
songsRouter.get('/', async (req, res) => {
    try {
        console.log("Find all");
        const allSongs = await Song.findAll({});
        return res.json(allSongs);
    } catch (err) {
        console.log('Something went wrong', err);
        return res.status(500).json({error: 'Something went wrong'});
    }
})


songsRouter.post('/', async (req, res) => {
    const {title, duration, userUuid} = req.body;
    try {
        if (!validator.isUUID(userUuid, [4])) {
            return res.status(400).json({error: "Invalid request (UUID not valid)"});
        }
        const authorObject = await Author.findOne({where: {uuid: userUuid}})
        if (authorObject) {
            const newSong = await Song.create({title, duration, authorId: authorObject.id});
            return res.status(201).json(newSong);
        } else {
            return res.status(404).json({error: "User not found"});
        }
    } catch (err) {
        console.log("Something went wrong", err);
        return res.status(500)
    }
})

songsRouter.put('/', async (req, res) => {
    try {
        res.send('Update Songs query');
    } catch (err) {
        res.send(err);
    }
})

songsRouter.delete('/', async (req, res) => {
    try {
        res.send('Delete Songs operation');
    } catch (err) {
        res.send(err);
    }
})

module.exports = songsRouter