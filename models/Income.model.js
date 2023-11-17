const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, default: 'income' },
});

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;