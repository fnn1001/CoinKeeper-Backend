// EXTERNAL DEPENDENCIES
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

// MODELS
const Category = require("../models/Category.model");

// Create one category
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

    const category = new Category({
      name: req.body.name,
    });

    try {
      const newCategory = await category.save();

      res.status(201).json(newCategory);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one category
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a category
router.patch(
  "/:id",
  [
    body("name").notEmpty().isString(),
  ],
  async (req, res) => {
    try {
      const categoryId = req.params.id;
      
      const name = req.body.name;

      const category = await Category.findById(categoryId);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      category.name = name;
      await category.save();

      res.status(200).json(category);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


// Delete one category
router.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
