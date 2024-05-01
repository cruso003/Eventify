const express = require("express");
const router = express.Router();
const eventTypeController = require("../controllers/eventTypeController");

// Routes for event type-related operations

// Get all event types
router.get("/", eventTypeController.getAllEventTypes);

// Create a new event type
router.post("/", eventTypeController.createEventType);

// Get a single event type by ID
router.get("/:id", eventTypeController.getEventTypeById);

// Update an event type by ID
router.put("/:id", eventTypeController.updateEventTypeById);

// Delete an event type by ID
router.delete("/:id", eventTypeController.deleteEventTypeById);

module.exports = router;
