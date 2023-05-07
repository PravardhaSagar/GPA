const authEntry = require("../authEntry.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
async function checkUserName(x) {
  console.log("Checking UserName: " + x);
  result = await authEntry.findOne({ userName: x });
  // console.log(result)
  if (result) {
    return true;
  } else {
    return false;
  }
}
async function checkCredentials(x, y) {
  result = await authEntry.findOne({ userName: x });
  console.log(result.password);
  res = await bcrypt.compare(y, result.password);
  if (res) {
    console.log("inside checkCredentials" + x);
    return true;
  } else {
    return false;
  }
}

async function authenticateToken(req, res, next) {
  const token = req.headers["x-access-token"];
  console.log(token);
  if (token == null) return res.sendStatus(401);
  try {
    user = jwt.verify(token, "secret123");
    console.log("Token:", user);
    if (res) {
      req.user = user;
      next();
    }
  } catch {
    return res.sendStatus(403);
  }
}
module.exports = { authenticateToken, checkCredentials, checkUserName };
