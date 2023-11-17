const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

const Expense = require("../models/Expense.model");

// Create one expense
router.post(
  "/",
  [
    body("amount").isNumeric(),
    body("categoryID").isMongoId(),
    body("date").isISO8601(),
  ],
  async (req, res) => {
    console.log("test expense route");

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // New expense object
    const expense = new Expense({
      amount: req.body.amount,
      categoryID: req.body.categoryID,
      date: req.body.date,
    });

    // Save newly created expense to the DB
    try {
      const newExpense = await expense.save();
      res.status(201).json(newExpense);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Get all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one expense
router.get("/:id", getExpense, (req, res) => {
  console.log("test get one expense");
  res.json(res.expense);
});

// Update one expense
router.patch("/:id", getExpense, async (req, res) => {
  console.log("test update one");
  if (req.body.amount != null) {
    res.expense.amount = req.body.amount;
  }
  if (req.body.categoryID != null) {
    res.expense.categoryID = req.body.categoryID;
  }
  if (req.body.date != null) {
    res.expense.date = req.body.date;
  }

  try {
    const updatedExpense = await res.expense.save();
    res.json(updatedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one expense
router.delete("/:id", getExpense, async (req, res) => {
  try {
    await res.expense.deleteOne();
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get a specific expense by ID
async function getExpense(req, res, next) {
  try {
    const expense = await Expense.findById(req.params.id);
    if (expense == null) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.expense = expense;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Global error handler middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = router;
