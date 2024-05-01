const Organizer = require("../model/Organizer");

// Controller for handling organizer-related operations

// Get all organizers
exports.getAllOrganizers = async (req, res) => {
  try {
    const organizers = await Organizer.find();
    res.json(organizers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new organizer
exports.createOrganizer = async (req, res) => {
  try {
    const organizer = new Organizer(req.body);
    const savedOrganizer = await organizer.save();
    res.status(201).json(savedOrganizer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single organizer by ID
exports.getOrganizerById = async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.params.id);
    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }
    res.json(organizer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an organizer by ID
exports.updateOrganizerById = async (req, res) => {
  try {
    const updatedOrganizer = await Organizer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedOrganizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }
    res.json(updatedOrganizer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an organizer by ID
exports.deleteOrganizerById = async (req, res) => {
  try {
    const deletedOrganizer = await Organizer.findByIdAndDelete(req.params.id);
    if (!deletedOrganizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }
    res.json({ message: "Organizer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
