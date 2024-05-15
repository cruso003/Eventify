const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventControllers");

// Routes for event-related operations

// Get all events
router.get("/", eventController.getAllEvents);

// Add a new event
router.post("/add-event", eventController.createEvent);

// Get an event by ID
router.get("/:id", eventController.getEventById);

// Delete an event by ID
router.delete("/:id", eventController.deleteEventById);

// Update an event by ID
router.put("/:id", eventController.updateEventById);

module.exports = router;
