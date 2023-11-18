const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    default: 'income',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Income', incomeSchema);