require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

module.exports = (req, res, next) => {
  
}
