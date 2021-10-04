const express = require('express');
const authorRouter = new express.Router();
const {Author} = require('../../models/');

authorRouter.get('/', async (req, res) => {
    try {
        res.send('Get author query');
    } catch (err) {
        res.send(err);
    }
})


authorRouter.post('/', async (req, res) => {
    const {name, birthday, label} = req.body;

    try {
        const newAuthor = await Author.create({name, birthday, label});
        res.status(201).send(newAuthor);
    } catch (e) {
        res.status(500).send({error: e.message || e});
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