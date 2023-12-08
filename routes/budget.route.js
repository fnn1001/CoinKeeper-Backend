// EXTERNAL DEPENDENCIES
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

// MODELS
const Budget = require("../models/Budget.model");
const Expense = require("../models/Expense.model")

// Create one budget
router.post(
  "/",
  [
    body("name").notEmpty().isString(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const budget = new Budget({
      name: req.body.name,
      max: req.body.max
    });

    try {
      const newBudget = await budget.save();

      res.status(201).json(newBudget);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

// Get all budgets
router.get("/", async (req, res) => {
  try {
    const budgets = await Budget.find().populate('expenses');
 
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one budget
router.get("/:id", async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id).populate("expenses");

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a budget
router.patch(
  "/:id",
  [
    body("name").notEmpty().isString(),
  ],
  async (req, res) => {
    try {
      const budgetId = req.params.id;
      
      const name = req.body.name;

      const budget = await Budget.findById(budgetId);

      if (!budget) {
        return res.status(404).json({ message: "Budget not found" });
      }

      budget.name = name;
      await budget.save();

      res.status(200).json(budget);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


// Delete one budget
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id
    const budget = await Budget.findById(id)

    await budget?.expenses?.forEach(async (expense) => {
      const expenseItem = await Expense.findById(expense)

      if(expenseItem) {
        expenseItem.budgetID = await null
        
        await expenseItem.save()
      }

    })

    await budget.deleteOne()

    res.json({ message: "Budget deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
