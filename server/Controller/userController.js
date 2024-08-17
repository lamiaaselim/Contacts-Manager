const jwt = require("jsonwebtoken"); 

const users = {
  user1: "user1",
  user2: "user2",
};

exports.loginUser = (req, res, next) => {
  const { username, password } = req.body;

  if (users[username] && users[username] === password) {
    // Generate a token
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {expiresIn: "1h"});
    res.json({ token });
  } else {
    res.status(401).send("Invalid credentials");
  }
}