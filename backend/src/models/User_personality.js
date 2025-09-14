import { DataTypes } from "sequelize";
import { sequelize } from "../../sequelize.js";

export const User_personality = sequelize.define("User_personality", {
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
    nickname: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM('Male','Female','Non-Binary','Trans Male','Trans Female', 'Agender','Genderqueer','Other', 'Prefer Not to Say'),
        allowNull: false,
        defaultValue: 'Prefer Not to Say',
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    contact: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    sleep_schedule: {
        type: DataTypes.TIME,
        allowNull: true,
        comment: 'Preferred sleep time'
    },
    lifestyle: {
        type: DataTypes.JSON,
        allowNull: true,  
        defaultValue: []
    },
    sleep_type: {
        type: DataTypes.ENUM('Early Bird', 'Night Owl', 'Flexible'),
        allowNull: false,
        defaultValue: 'Flexible'
    },
    study_habits: {
        type: DataTypes.ENUM('silent', 'some_noise', 'flexible'),
        allowNull: false,
        defaultValue: 'flexible'
    },
    cleanliness: {
        type: DataTypes.ENUM('Neat Freak', 'Average', 'Messy'),
        allowNull: false,
        defaultValue: 'Average'
    },
    social: {
        type: DataTypes.ENUM('Quiet', 'Social', 'Moderate'),
        allowNull: false,
        defaultValue: 'Moderate'
    },
    // 🔧 ISSUE FIXED: Removed extra space in field name (was "MBTI :" now "MBTI:")
    // This syntax error was causing potential parsing issues
    MBTI: {
        type: DataTypes.ENUM('INTJ', 'INFP', 'ENTJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP', 'INFJ', 'INTP', 'ENFJ', 'ENTP'),
        allowNull: false
    },
    going_out: {
        type: DataTypes.ENUM('Homebody', 'Occasional', 'Frequent'),
        allowNull: false
    },
    smoking: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    drinking: {
        type: DataTypes.ENUM('Never', 'Occasional', 'Frequent'),
        allowNull: false
    },
    pets: {
        type: DataTypes.ENUM('No Pets', 'Allergic', 'Pet Owner', 'Pet Friendly', 'Cat Person', 'Dog Person', 'Dog & Cat Person', 'Flexible', 'Do not like pets'),
        allowNull: false,
        defaultValue: 'Flexible'
    },
    noise_tolerance: {
        type: DataTypes.ENUM('Low', 'Medium', 'High', 'Flexible'),
        allowNull: false,
        defaultValue: 'Flexible'
    },
    temperature: {
        type: DataTypes.ENUM('Cold', 'Cool', 'Warm', 'Hot', 'Flexible'),
        allowNull: false,
        defaultValue: 'Flexible'
    } 
}, {
    tableName: 'personalities',
    timestamps: true    

});

