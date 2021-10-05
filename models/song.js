'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Song extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Author}) {
            // define association here
            this.belongsTo(Author, {foreignKey: 'authorId', as: 'author'})
        }

        toJSON() {
            return {...this.get(), id: undefined, authorId: undefined};
        }
    };
    Song.init({
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        authorId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                this.setDataValue('title', value.trim())
            },
            validate: {
                notNull: {msg: "Null value not allowed"},
                notEmpty: {msg: "Empty value not allowed"}
            }
        },
        duration: {
            type: DataTypes.BIGINT,
            allowNull: true,
            validate: {
                isInt: {msg: "Value should be Number"}
            }
        }
    }, {
        sequelize,
        tableName: 'songs',
        modelName: 'Song',
    });
    return Song;
};