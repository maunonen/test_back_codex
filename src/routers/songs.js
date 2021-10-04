const express = require('express');
const songsRouter = new express.Router();
const {Song} = require('../../models/');

/* Получить все песни определенного исполнителя или нескольких исполнителей.*/
/* Получить выборку песен или исполнителей по части их названия.*/
/* Получить выборку песен или исполнителей по дате внесения записи.*/
/* Получить часть выборки песен или исполнителей. Например,
    10 песен, идущих после первых 20-и от начала выборки.
*/

songsRouter.get('/', async (req, res) => {
    try {
        res.send('Get songs query');
    } catch (err) {
        console.log('Something went wrong', err);
    }
})


songsRouter.post('/', async (req, res) => {
    const {title, duration} = req.body;
    try {
        const newSong = await Song.create({title, duration});
        return res.status(201).json(newSong);
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