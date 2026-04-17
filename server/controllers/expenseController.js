const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
  
  try {
    const expense = await Expense.create({
      ...req.body,
      user: req.userId,
    });

    res.json(expense);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json("Deleted");
  } catch (err) {
    res.status(500).json(err.message);
  }
};