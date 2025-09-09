import { DataTypes } from "sequelize";
import { sequelize } from "../../sequelize.js";

export const Rating = sequelize.define("Rating", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',  // Updated to match actual table name
      key: 'id'
    }
  },
  dormId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'dorms',  // Updated to match actual table name
      key: 'id'
    }
  },
}, {
  timestamps: true,
  tableName: 'ratings',  // Set explicit table name
  indexes: [
    {
      unique: true,
      fields: ['userId', 'dormId'] // One rating per user per dorm
    }
  ]
});