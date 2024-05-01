const EventType = require("../model/EventType");

// Controller for handling event type-related operations

// Get all event types
exports.getAllEventTypes = async (req, res) => {
  try {
    const eventTypes = await EventType.find();
    res.json(eventTypes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new event type
exports.createEventType = async (req, res) => {
  try {
    const eventType = new EventType(req.body);
    const savedEventType = await eventType.save();
    res.status(201).json(savedEventType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single event type by ID
exports.getEventTypeById = async (req, res) => {
  try {
    const eventType = await EventType.findById(req.params.id);
    if (!eventType) {
      return res.status(404).json({ message: "Event type not found" });
    }
    res.json(eventType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an event type by ID
exports.updateEventTypeById = async (req, res) => {
  try {
    const updatedEventType = await EventType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEventType) {
      return res.status(404).json({ message: "Event type not found" });
    }
    res.json(updatedEventType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an event type by ID
exports.deleteEventTypeById = async (req, res) => {
  try {
    const deletedEventType = await EventType.findByIdAndDelete(req.params.id);
    if (!deletedEventType) {
      return res.status(404).json({ message: "Event type not found" });
    }
    res.json({ message: "Event type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
