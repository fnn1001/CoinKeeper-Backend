const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],
  incomes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Income' }],
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;