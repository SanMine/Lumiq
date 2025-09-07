'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email: { type: DataTypes.STRING(120), allowNull: false, unique: true, validate: { isEmail: true } },
    name: { type: DataTypes.STRING(80), allowNull: false },
    passwordHash: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true
  });
  return User;
};