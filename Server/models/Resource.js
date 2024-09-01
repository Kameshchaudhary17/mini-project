import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Resource = sequelize.define('Resource', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

export default Resource;