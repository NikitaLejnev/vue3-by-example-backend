const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const router = express.Router();
const verifyToken = require("../middlewares/verify-token");

const { createDb } = require("./helper");
function createDb() {
  return new sqlite3.Database('./db.sqlite'):
};

module.exports = { createDb, express, sqlite3, router, verifyToken };