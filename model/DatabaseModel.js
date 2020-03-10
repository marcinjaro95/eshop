const mysql = require('mysql');
const createDbQuery = require('./createDbQuery');

class DatabaseModel {
  constructor() {
    this.config = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true,
    };
    this.connection = this.createConnection();
  }

  isDatabaseExist() {
    let boolean = false;
    this.createQuery('USE eshop', (err) => {
      if (err) {
        console.log(err);
      } else {
        boolean = true;
      }
    });
    return boolean;
  }

  createConnection() {
    return mysql.createConnection(this.config);
  }

  createDatabase() {
    this.createQuery(createDbQuery, err => console.log(err));
  }

  createQuery(query, callback) {
    this.connection.query(query, callback);
  }
}

module.exports = DatabaseModel;
