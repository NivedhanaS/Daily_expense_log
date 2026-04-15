const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    console.log("HEADER:", token); // 👈 ADD THIS

    if (!token) return res.status(401).json("No token");

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    console.log("TOKEN AFTER SPLIT:", token); // 👈 ADD THIS

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message); // 👈 ADD THIS
    res.status(401).json("Invalid token");
  }
};