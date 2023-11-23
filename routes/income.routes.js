// EXTERNAL DEPENDENCIS
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// MODELS
const Income = require('../models/Income.model');

// Create one income
router.post('/', [
  body('amount').notEmpty().isNumeric(),
  body('date').optional().isISO8601(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const income = new Income({
      amount: req.body.amount,
      date: req.body.date || Date.now(),
    });

    const newIncome = await income.save();
    res.status(201).json(newIncome);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get one income
router.get('/:id', async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.json(income);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update one income
router.patch('/:id', [
  body('amount').optional().isNumeric(),
  body('date').optional().isISO8601(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const incomeID = req.params.id;
    const { amount, date } = req.body;

    const income = await Income.findById(incomeID);

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    // Update the income properties if they are present in the request body
    if (amount !== undefined) {
      income.amount = amount;
    }

    if (date !== undefined) {
      income.date = date;
    }

    // Save the updated income
    const updatedIncome = await income.save();
    res.json(updatedIncome);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one income
router.delete('/:id', async (req, res) => {
  try {
    const deletedIncome = await Income.findByIdAndDelete(req.params.id);

    if (!deletedIncome) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.json({ message: 'Income deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
