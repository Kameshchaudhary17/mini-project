import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Resource from './Resource.js';

const Checkout = sequelize.define('Checkout', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

Checkout.belongsTo(Resource);
Resource.hasMany(Checkout);

export default Checkout;