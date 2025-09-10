import { DataTypes } from "sequelize";
import { sequelize } from "../../sequelize.js";

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
                model: 'dorms',
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
            type: DataTypes.JSON,
            allowNull: true,
            comment: 'Array of image URLs stored as JSON'
        },
        status: {
            type: DataTypes.ENUM('Available', 'Reserved', 'Occupied', 'Maintenance'),
            allowNull: false,
            defaultValue: 'Available',
        },
        current_resident_id: {
            type: DataTypes.INTEGER,
            allowNull: true, // Can be null when room is empty
            references: {
                model: 'users',
                key: 'id'
            },
        },
        expected_move_in_date: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Expected date when new tenant will move in'
        },
        expected_available_date: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Expected date when room will become available (move out date)'
        },
        // Virtual fields for easier access
        image_urls: {
            type: DataTypes.VIRTUAL,
            get() {
                const images = this.getDataValue('images');
                return images ? (Array.isArray(images) ? images : []) : [];
            }
        },
        current_resident_name: {
            type: DataTypes.VIRTUAL,
            get() {
                const user = this.getDataValue('CurrentResident');
                return user ? user.name : null;
            }
        },
        display_status: {
            type: DataTypes.VIRTUAL,
            get() {
                const status = this.getDataValue('status');
                const expectedDate = this.getDataValue('expected_available_date');
                
                if (status === 'Available') {
                    return 'Available Now';
                } else if ((status === 'Occupied' || status === 'Reserved') && expectedDate) {
                    return `${status} until ${expectedDate.toLocaleDateString()}`;
                } else {
                    return status;
                }
            }
        }
    },
    {
        timestamps: true,
        tableName: 'rooms',
        indexes: [
            {
                unique: true,
                fields: ['room_number', 'dormId'],
            },
        ]
    }
)