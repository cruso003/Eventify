const Category = require("../model/EventCategory");
const EventType = require("../model/EventType");

// Controller for handling category-related operations

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, eventType } = req.body;

    {
      /*// Check if a category with the same name already exists within the specified event type
    const existingCategory = await Category.findOne({ name, eventType });
    if (existingCategory) {
      return res.status(400).json({
        message: "Category with this name already exists ",
      });
    }*/
    }

    // Create a new category
    const newCategory = { name };

    // Update the corresponding event type
    const updatedEventType = await EventType.findByIdAndUpdate(
      eventType,
      { $push: { categories: newCategory } }, // Assuming categories are stored as IDs in EventType model
      { new: true }
    );

    // Send the updated event type to the client as a response
    res.status(201).json(updatedEventType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a category by ID
exports.updateCategoryById = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a category by ID
exports.deleteCategoryById = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
