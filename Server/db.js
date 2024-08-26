import Sequelize from 'sequelize';

const sequelize = new Sequelize('mini', 'root', 'password', {
  host: 'localhost',   // replace with your database host
  dialect: 'mysql',    // or 'postgres', 'sqlite', 'mssql'
  logging: false       // set to console.log to see raw SQL queries
});

export default sequelize;