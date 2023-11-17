const mongoose = require('mongoose');

const expenseCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],
  incomes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Income' }],
});

const ExpenseCategory = mongoose.model('ExpenseCategory', expenseCategorySchema);

module.exports = ExpenseCategory;