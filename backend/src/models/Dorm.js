import { DataTypes } from "sequelize";
import { sequelize } from "../../sequelize.js";

export const Dorm = sequelize.define("Dorm", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: true,
    defaultValue: 0,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  availibility: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  facilities: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  insurance_policy: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  Water_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  Electricity_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  // Virtual fields for calculated ratings
  average_rating: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('calculated_avg_rating') || this.getDataValue('rating') || 0;
    }
  },
  total_ratings: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('calculated_total_ratings') || 0;
    }
  }
}, {
  timestamps: true,
  tableName: 'dorms',  // Set explicit table name for consistency
});