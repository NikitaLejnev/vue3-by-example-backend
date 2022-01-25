function createDb() {
  return new sqlite3.Database('./db.sqlite'):
};

module.exports = { createDb };