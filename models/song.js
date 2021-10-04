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
    static associate({ Author}) {
      // define association here
      this.belongsTo(Author, { foreignKey : 'authorId'})

    }
    toJSON() {
      return { ...this.get(), id : undefined, authorId : undefined};
    }
  };
  Song.init({
    uuid: {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV4
    },
    authorId : {
      type : DataTypes.INTEGER,
      allowNull: false
    },
    title:  {
      type : DataTypes.STRING,
      allowNull : false
    },
    duration: DataTypes.BIGINT
  }, {
    sequelize,
    tableName : 'songs',
    modelName: 'Song',
  });
  return Song;
};