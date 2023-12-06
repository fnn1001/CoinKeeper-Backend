const express = require("express");
const router = express.Router();

const budgetRoute = require('./budget.route.js')
const expenseRoute = require('./expense.routes.js')


router.get("/", (req, res, next) => {
  res.status(200).json("All good in here");
});

router.use('/expenses', expenseRoute);
router.use('/budgets', budgetRoute);

module.exports = router;
