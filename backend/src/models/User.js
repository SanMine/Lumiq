import { DataTypes } from "sequelize";
import { sequelize } from "../../sequelize.js";

export const User = sequelize.define("User", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  email: { 
    type: DataTypes.STRING(120), 
    allowNull: false, unique: true, 
    validate: { isEmail: true } 
  },
  name:  { 
    type: DataTypes.STRING(80), 
    allowNull: false 
  }
}, {
  tableName: "users",
  underscored: true
});

