/*
const {Sequelize, DataTypes} = require('sequelize');

const db = require('../config/database');
const Author = require("./Author");

const Song = db.define('Song', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title : {
        type : DataTypes.STRING
    },
    duration : {
        type : DataTypes.INTEGER
    },
    author_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Author,
            key: 'id',
            /!*deferrable: Deferrable.INITIALLY_IMMEDIATE*!/
        }
    },

})

module.exports = Song*/
