const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  max: { type: Number, required: false },
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;