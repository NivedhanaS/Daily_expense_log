const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;


    if (!token) return res.status(401).json("No token");

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json("Invalid token");
  }
};