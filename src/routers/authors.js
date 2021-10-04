const express = require('express');
const authorRouter = new express.Router();

authorRouter.get('/', async (req, res) => {
    try {
        res.send('Get author query');
    } catch (err) {
        res.send(err);
    }
})


authorRouter.post('/',  async (req, res ) => {
    try {
        res.status(201).send('Post author query');
    } catch (e) {
        res.status(400).send( { error : e.message || e });
    }
})

authorRouter.put('/', async (req, res) => {
    try {
        res.send('Update author query');
    } catch (err) {
        res.send(err);
    }
})

authorRouter.delete('/', async (req, res) => {
    try {
        res.status(200).send('Delete author operation');
    } catch (err) {
        res.send(err);
    }
})

module.exports = authorRouter