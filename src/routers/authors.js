const express = require('express');
const authorRouter = new express.Router();
const {Author} = require('../../models/');
const cyrillicToTranslit = require('cyrillic-to-translit-js');
const validator = require('validator');

authorRouter.get('/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    try {
        if (!validator.isUUID(uuid, [4])) {
            return res.status(400).json({error: "Invalid request (UUID not valid)"});
        }
        const authorById = await Author.findOne({
            where: {uuid},
            include : 'songs',
        });
        return res.json(authorById);
    } catch (err) {
        console.log('Something went wrong', err);
        return res.status(500).json({error: 'Something went wrong'});
    }
})

authorRouter.get('/', async (req, res) => {
    try {
        res.send('Get author query');
    } catch (err) {
        res.send(err);
    }
})

function isAllowedAuthor(authorName) {
    let translitToLatin = cyrillicToTranslit().transform(authorName.toLowerCase());
    if (translitToLatin === 'monetochka') {
        return false
    }
    return true
}

authorRouter.post('/', async (req, res) => {
    const {name, birthday, label} = req.body;
    try {
        if (!isAllowedAuthor(name)) {
            return res.status(400).json({error: "Author is not allowed"});
        }
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