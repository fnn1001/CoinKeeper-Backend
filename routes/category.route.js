const express = require('express');
const router = express.Router();
const Category = require('../models/Category.model');

// Create one category
router.post('/', async (req, res) => {
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
router.get('/', async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get one category
router.get('/:id', getCategory, (req, res) => {
    res.json(res.category);
  });

  // Update one category
router.patch('/:id', getCategory, async (req, res) => {
    if (req.body.name != null) {
      res.category.name = req.body.name;
    }
  
    try {
      const updatedCategory = await res.category.save();
      res.json(updatedCategory);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // Delete one category
router.delete('/:id', getCategory, async (req, res) => {
    try {
      await res.category.deleteOne();
      res.json({ message: 'Category deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Middleware function to get a specific category by ID
async function getCategory(req, res, next) {
    try {
      const category = await Category.findById(req.params.id);
      if (category == null) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.category = category;
      next();
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

module.exports = router;
