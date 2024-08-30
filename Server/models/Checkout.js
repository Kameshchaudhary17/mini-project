import DataTypes from 'sequelize';
import sequelize from '../db.js';
import Resource from './Resource.js';

const Checkout = sequelize.define('Checkout', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  checkedOutAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

Resource.hasOne(Checkout);
Checkout.belongsTo(Resource);

export default Checkout;