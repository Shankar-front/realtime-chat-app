const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
  "./chat.db",
  (err) => {

    if (err) {
      console.log(err);
    } else {
      console.log("SQLite connected");
    }

  }
);


// USERS TABLE
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`);


// ROOMS TABLE
db.run(`
  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
  )
`);


// MESSAGES TABLE
db.run(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roomId TEXT,
    username TEXT,
    message TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);


module.exports = db;