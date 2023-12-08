const express = require('express');
const router = express.Router();
const Investment = require('../models/Invest.model'); 

// Route to get all investments
router.get('/', async (req, res) => {
  try {
    const investments = await Investment.find();
    res.json(investments);
  } catch (error) {
    console.error('Error fetching investments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get investments for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userInvestments = await Investment.find({ userId });
    res.json(userInvestments);
  } catch (error) {
    console.error('Error fetching user investments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  console.log("Received body:", req.body); // Log the received body

  try {
    const { userId, Coin, date, amount, purchasePrice } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const newInvestment = new Investment({ 
      userId, 
      Coin, 
      date: new Date(date),
      amount, 
      purchasePrice 
    });

    await newInvestment.save();
    res.status(201).json({ message: 'Investment added successfully', investment: newInvestment });
  } catch (error) {
    console.error('Error adding investment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to update an investment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { currency, purchaseDate, purchaseAmount } = req.body;
    const updatedInvestment = await Investment.findByIdAndUpdate(id, { currency, purchaseDate, amount: purchaseAmount }, { new: true });
    if (updatedInvestment) {
      res.status(200).json({ message: 'Investment updated successfully', investment: updatedInvestment });
    } else {
      res.status(404).json({ error: 'Investment not found' });
    }
  } catch (error) {
    console.error('Error updating investment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to delete an investment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInvestment = await Investment.findByIdAndDelete(id);
    if (deletedInvestment) {
      res.status(200).json({ message: 'Investment deleted successfully' });
    } else {
      res.status(404).json({ error: 'Investment not found' });
    }
  } catch (error) {
    console.error('Error deleting investment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
