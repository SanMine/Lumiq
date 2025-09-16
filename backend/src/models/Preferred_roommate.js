import { DataTypes } from "sequelize";
import { sequelize } from "../../sequelize.js";
import { User } from "./User.js";

export const Preferred_roommate = sequelize.define("Preferred_roommate", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        }
    },
    preferred_age_range: {
        type: DataTypes.JSON,
        allowNull: true,  // Changed to true to allow optional field
        defaultValue: { min: 18, max: 30 } // Default age range
    },
    preferred_gender: {
        type: DataTypes.ENUM('Male','Female','Non-Binary','Trans Male','Trans Female', 'Agender','Genderqueer','Any'),
        allowNull: true,
        defaultValue: 'Any'
    },
    preferred_nationality: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    preferred_sleep_type: {
        type: DataTypes.ENUM('Early Bird', 'Night Owl', 'Any'),
        allowNull: false,
        defaultValue: 'Any'
    },
    preferred_smoking: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false // Default smoking preference
    },
    preferred_pets: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false // Default pets preference
    },
    preferred_noise_tolerance: {
        type: DataTypes.ENUM('Low', 'Medium', 'High', 'Flexible'),
        allowNull: false,
        defaultValue: 'Medium'
    },
    preferred_cleanliness: {
        type: DataTypes.ENUM('Tidy', 'Moderate', 'Messy'),
        allowNull: false,
        defaultValue: 'Moderate'
    },
    preferred_MBTI: {
        type: DataTypes.ENUM('INTJ', 'INFP', 'ENTJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP', 'INFJ', 'INTP', 'ENFJ', 'ENTP', 'Any'),
        allowNull: true,
        defaultValue: 'Any'
    },
    preferred_temperature: {
        type: DataTypes.ENUM('Cold', 'Cool', 'Warm', 'Hot', 'Flexible'),
        allowNull: false,
        defaultValue: 'Flexible'
    },
    additional_preferences: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    preferred_dorms: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [] // Array of preferred dorm IDs
    }
}, {
    tableName: "preferred_roommate",
    timestamps: true
});
