import { DataTypes } from "sequelize";
import { sequelize } from "../../sequelize.js";
import { Dorm } from "./Dorm.js";
import { dorms } from "../routes/dorms.js";

export const Room = sequelize.define("Room", 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        dormId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'dorms',  // Updated to match actual table name
                key: 'id'
            },
        
        },
        room_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        room_type: {
            type: DataTypes.ENUM('Single', 'Double', 'Triple'),
            allowNull: false,
            defaultValue: 'Single',
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate:{
                min: 1,
                max: 3,
            }
        },
        price_per_month: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        floor: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        amenities: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        images: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('Available', 'Occupied', 'Maintenance'),
            allowNull: false,
            defaultValue: 'Available',
        }
    },
    {
        timestamps: true,
        tableName: 'rooms',  // Set explicit table name
        indexes: [
            {
                unique: true,
                fields: ['room_number', 'dormId'],

            },]
            
    }
)