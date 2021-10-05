const validator = require('validator');
const cyrillicToTranslit = require('cyrillic-to-translit-js');

function isValidUUID(uuid, res) {
    if (uuid === undefined || uuid === null || typeof (uuid) !== "string") {
        return false
    }
    if (!validator.isUUID(uuid, [4])) {
        return res.status(400).json({error: "Invalid request (UUID not valid)"});
    }
    return true
}

function isAllowedAuthor(authorName) {
    return cyrillicToTranslit()
        .transform(authorName.toLowerCase())
        .indexOf('monetochka') === -1;
}

module.exports = {
    isValidUUID, isAllowedAuthor,
}