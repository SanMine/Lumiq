import { DataTypes } from "sequelize";  
import { sequelize } from "../../sequelize.js";

export const Dorm = sequelize.define ("Dorm", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,   
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: false
  }
}, {
  tableName: "dorms",
  underscored: true
});