'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Author extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Song }) {
            // define association here
            this.hasMany(Song, { foreignKey : 'authorId'})
        }
        toJSON() {
            return { ...this.get(), id : undefined};
        }
    };
    Author.init({
        uuid: {
            type : DataTypes.UUID,
            defaultValue : DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birthday: DataTypes.DATEONLY,
        label: DataTypes.STRING
    }, {
        sequelize,
        tableName: 'authors',
        modelName: 'Author',
    });
    return Author;
};