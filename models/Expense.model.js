const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  name: { type: String, required: false },
  description: { type: String, required: false },
  amount: { type: Number, required: true },
  budgetID: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget' },
  date: { type: Date, default: Date.now },
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
