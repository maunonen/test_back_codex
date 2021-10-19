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
        static associate({Song}) {
            // define association here
            this.hasMany(Song, {foreignKey: 'authorId', as: 'songs', onDelete: 'cascade'});
        }

        toJSON() {
            return {...this.get(), id: undefined};
        }
    };

    Author.init({
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                this.setDataValue('name', value.trim())
            },
            validate: {
                notNull: {msg: "Null value not allowed"},
                notEmpty: {msg: "Empty value not allowed"}
            }
        },
        birthday: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            validate: {
                isDate: {
                    msg: "Value should be in Date format"
                }
            }
        },
        label: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        sequelize,
        tableName: 'authors',
        modelName: 'Author',
    });
    return Author;
};