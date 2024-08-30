import DataTypes from 'sequelize';
import sequelize from '../db.js';

const Resource = sequelize.define('Resource', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  photoUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

export default Resource;