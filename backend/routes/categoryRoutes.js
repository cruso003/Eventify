const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Routes for category-related operations

// Get all categories
router.get("/", categoryController.getAllCategories);

// Create a new category
router.post("/", categoryController.createCategory);

// Get a single category by ID
router.get("/:id", categoryController.getCategoryById);

// Update a category by ID
router.put("/:id", categoryController.updateCategoryById);

// Delete a category by ID
router.delete("/:id", categoryController.deleteCategoryById);

module.exports = router;
