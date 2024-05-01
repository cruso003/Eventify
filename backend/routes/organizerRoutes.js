const express = require("express");
const router = express.Router();
const organizerController = require("../controllers/organizerController");

// Routes for organizer-related operations

// Get all organizers
router.get("/", organizerController.getAllOrganizers);

// Create a new organizer
router.post("/", organizerController.createOrganizer);

// Get a single organizer by ID
router.get("/:id", organizerController.getOrganizerById);

// Update an organizer by ID
router.put("/:id", organizerController.updateOrganizerById);

// Delete an organizer by ID
router.delete("/:id", organizerController.deleteOrganizerById);

module.exports = router;
