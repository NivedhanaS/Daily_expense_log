const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  amount: Number,
  category: String,
  date: Date,
  note: String,
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);