// models/User.js
import DataTypes from 'sequelize'
import sequelize from '../db.js'; // Your Sequelize connection

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('User', 'Admin'),
    defaultValue: 'User',
    allowNull: false,
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

export default User;
