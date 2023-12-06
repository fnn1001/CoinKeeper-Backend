// EXTERNAL DEPENDENCIES
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

// MODELS
const Expense = require("../models/Expense.model");
const Budget = require("../models/Budget.model");

// Create one expense
router.post(
  "/",
  [
    body("amount").isNumeric(),
    body("budgetID").isMongoId(),
    body("date").isISO8601(),
    body("name").optional()
  ],
  async (req, res) => {
    console.log("test expense route");

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract budget ID from the request
    const budgetID = req.body.budgetID;

    // New expense object
    const expense = new Expense({
      amount: req.body.amount,
      budgetID: budgetID, // here is the link to the budget's id
      date: req.body.date,
      name: req.body.name,
    });

    // Save newly created expense to the DB
    try {
      const newExpense = await expense.save();

      // Retrieve expense's ID

      const expenseID = newExpense._id
      console.log(expenseID)

      // Retrieve the corresponding Budget to add the expense to it
      const budget = await Budget.findById(budgetID);
      
      if (!budget) {
        res.status(400).json({ message: err.message });

      } else {
        budget.expenses = [...budget.expenses, expenseID]
        await budget.save()
        
        res.status(201).json(newExpense);
      }
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
router.get("/:id", (req, res) => {

});

// Update one expense
router.patch("/:id", async (req, res) => {
  const expenseID = req.params.id
  
  const amount = req.body.amount
  const name = req.body.name

  const expense = await Expense.findById(expenseID)
  
  expense.amount = amount
  expense.name = name

  expense.save()
  
  res.status(200).json(expense)
})


// Delete one expense
router.delete("/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Global error handler middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = router;
