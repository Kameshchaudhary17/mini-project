// models/Resource.js
import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import User from './user.js';

const Resource = sequelize.define('Resource', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  photo: {
    type: DataTypes.STRING,
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Reference to User model
      key: 'id',
    },
  },
}, {
  timestamps: true, // Keeps track of createdAt and updatedAt
  paranoid: false, // Disable soft deletes to avoid looking for deletedAt column
});

User.hasMany(Resource, { foreignKey: 'createdBy' });
Resource.belongsTo(User, { foreignKey: 'createdBy' });

export default Resource;
