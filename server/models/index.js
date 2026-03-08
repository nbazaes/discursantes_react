'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (process.env.MYSQL_URL || process.env.DATABASE_URL) {
  // Conexión vía URL completa (si existe la variable)
  sequelize = new Sequelize(process.env.MYSQL_URL || process.env.DATABASE_URL, config);
} else {
  // Conexión vía variables individuales (Railway MySQL las provee por defecto)
  const dbConfig = {
    database: process.env.MYSQLDATABASE || config.database,
    username: process.env.MYSQLUSER     || config.username,
    password: process.env.MYSQLPASSWORD || config.password,
    host:     process.env.MYSQLHOST     || config.host,
    port:     process.env.MYSQLPORT     || config.port || 3306,
    dialect:  config.dialect || 'mysql',
  };
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
  });
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
