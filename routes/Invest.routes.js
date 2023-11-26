// EXTERNAL DEPENDENCIES
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// MODELS
const Investment = require('../models/Invest.model');

// Create one investment
router.post('/', [
  body('currency').notEmpty().isString(),
  body('purchaseDate').notEmpty().isISO8601(),
  body('purchaseAmount').notEmpty().isNumeric(),
  body('sellingPrice').optional().isNumeric(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const investment = new Investment({
      currency: req.body.currency,
      purchaseDate: req.body.purchaseDate,
      purchaseAmount: req.body.purchaseAmount,
      sellingPrice: req.body.sellingPrice,
      // add other investment-related fields
    });

    const newInvestment = await investment.save();
    res.status(201).json(newInvestment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get one investment
router.get('/:id', async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    res.json(investment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update one investment
router.patch('/:id', [
  body('currency').optional().isString(),
  body('purchaseDate').optional().isISO8601(),
  body('purchaseAmount').optional().isNumeric(),
  body('sellingPrice').optional().isNumeric(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const investmentId = req.params.id;
    const { currency, purchaseDate, purchaseAmount, sellingPrice } = req.body;

    const investment = await Investment.findById(investmentId);

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    // Update the investment properties if they are present in the request body
    if (currency !== undefined) {
      investment.currency = currency;
    }

    if (purchaseDate !== undefined) {
      investment.purchaseDate = purchaseDate;
    }

    if (purchaseAmount !== undefined) {
      investment.purchaseAmount = purchaseAmount;
    }

    if (sellingPrice !== undefined) {
      investment.sellingPrice = sellingPrice;
    }

    // Save the updated investment
    const updatedInvestment = await investment.save();
    res.json(updatedInvestment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one investment
router.delete('/:id', async (req, res) => {
  try {
    const deletedInvestment = await Investment.findByIdAndDelete(req.params.id);

    if (!deletedInvestment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    res.json({ message: 'Investment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
