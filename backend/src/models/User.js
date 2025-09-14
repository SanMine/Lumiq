import { DataTypes } from "sequelize";
import { sequelize } from "../../sequelize.js";
import bcrypt from "bcryptjs";

export const User = sequelize.define("User", {

  id: { type: 
    DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true },

  email: { type: DataTypes.STRING(100),
    allowNull: false, 
    unique: true },

  name: { type: 
    DataTypes.STRING(100), 
    allowNull: false },

  // 🔐 Password field for storing scrambled password
  passwordHash : {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  role : {
    type : DataTypes.ENUM('student', 'admin', 'owner'),
    allowNull: false,
    defaultValue: 'student'    
  }
}, {
  tableName: 'users',
  timestamps: true,

  // 🔒 SECURITY MAGIC: Hide passwords from normal queries
  defaultScope: {
    attributes: {
      exclude: ['passwordHash']
    }
  },

  // 🔍 Special scope: When we DO need to check passwords (login)
  scopes: {
    withPassword: { 
      attributes: { 
        include: ['passwordHash'] 
      } 
    }
  }

});

// 🧪 Helper functions  
// Scrambles a plain password
User.hashPassword = async function(plainPassword) {
  const scrambledPassword = await bcrypt.hash(plainPassword, 12);
  return scrambledPassword;
};

// Check if a plain password matches the hashed version
User.checkPassword = async function(plainPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};

// Find user by email and include password for authentication
User.findByEmailWithPassword = async function(email) {
  const user = await User.scope('withPassword').findOne({
    where: { email: email.toLowerCase() }
  });
  return user;
};