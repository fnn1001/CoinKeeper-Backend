const express = require('express');
const router = express.Router();

const Income = require('../models/Income.model');

// Create one income
router.post('/', async (req, res) => {
    const income = new Income({
      amount: req.body.amount,
      category: 'income',
      date: req.body.date || Date.now(),
    });
  
    try {
      const newIncome = await income.save();
      res.status(201).json(newIncome);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

// Get one income
router.get('/:id', getIncome, (req, res) => {
    res.json(res.income);
  });

  // Update one income
router.patch('/:id', getIncome, async (req, res) => {
    if (req.body.amount != null) {
      res.income.amount = req.body.amount;
    }
    if (req.body.date != null) {
      res.income.date = req.body.date;
    }
  
    try {
      const updatedIncome = await res.income.save();
      res.json(updatedIncome);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // Delete one income
router.delete('/:id', getIncome, async (req, res) => {
    try {
      await res.income.deleteOne();
      res.json({ message: 'Income deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Middleware function to get a specific income by ID
async function getIncome(req, res, next) {
    try {
      const income = await Income.findById(req.params.id);
      if (income == null) {
        return res.status(404).json({ message: 'Income not found' });
      }
      res.income = income;
      next();
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }


module.exports = router;
