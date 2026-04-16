const User = require("../models/User");

// GET user data
exports.getUserData = async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({
    income: user.income,
    savingGoal: user.savingGoal,
  });
};

// UPDATE user data
exports.updateUserData = async (req, res) => {
  const { income, savingGoal } = req.body;

  const user = await User.findById(req.userId);

  user.income = income;
  user.savingGoal = savingGoal;

  await user.save();

  res.json(user);
};