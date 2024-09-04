// models/Checkout.js
import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Resource from './Resource.js';

const Checkout = sequelize.define('Checkout', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ResourceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Resource,
      key: 'id',
    },
  },
}, {
  timestamps: true,
  paranoid: false, // Enables soft deletion
});

export default Checkout;
