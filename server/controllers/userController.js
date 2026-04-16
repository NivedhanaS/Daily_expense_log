const User = require("../models/User");

// GET user data
exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json("User not found");

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};

exports.updateUserData = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json("User not found");

    user.income = Number(req.body.income);
    user.savingGoal = Number(req.body.savingGoal);

    await user.save();

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
  
};