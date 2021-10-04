const express = require('express');
const songsRouter = new express.Router();

songsRouter.get('/', async (req, res) => {
    try {
        res.send('Get songs query');
    } catch (err) {
        res.send(err);
    }
})


songsRouter.post('/',  async (req, res ) => {
    try {
        res.status(201).send('Post Songs query');
    } catch (e) {
        res.status(400).send( { error : e.message || e });
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