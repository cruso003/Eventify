const Event = require("../model/Events");
const EventType = require("../model/EventType");
const Category = require("../model/EventCategory");
const Organizer = require("../model/Organizer");
const User = require("../model/User");
const cloudinary = require("cloudinary").v2;

const options = {
  provider: "google",
  apiKey: "AIzaSyCnqbebQOpYAMedUi-Ct_xKwXmWlMsO_Q4",
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dl43pywkr",
  api_key: "541348946389798",
  api_secret: "v3V36QAwudb1yX-MwBypg5xBowQ",
});

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new event
exports.createEvent = async (req, res) => {
  try {
    const file = req.file;

    // Upload image to Cloudinary
    const cloudinaryUpload = await cloudinary.uploader.upload(file.path, {
      folder: "event_images",
    });

    const {
      eventType,
      name,
      startingTime,
      description,
      latitude,
      longitude,
      category,
      tickets,
      owner,
    } = req.body;

    // Find the ObjectIds for eventType and owner
    const [eventTypeObj, ownerObj] = await Promise.all([
      EventType.findOne({ name: eventType }),
      User.findOne({ businessName: owner }),
    ]);

    if (!eventTypeObj || !ownerObj) {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    // Parse tickets from JSON string to array
    const parsedTickets = JSON.parse(tickets);

    // Create a new event with image URL and coordinates
    const newEvent = new Event({
      eventType: eventTypeObj._id,
      category,
      owner: ownerObj._id,
      name,
      startingTime,
      imageUrl: cloudinaryUpload.secure_url,
      description,
      tickets: parsedTickets,
      location: {
        type: "Point",
        coordinates: [parseFloat(latitude), parseFloat(longitude)],
      },
    });

    const savedEvent = await newEvent.save();

    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error in createEvent:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get an event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an event by ID
exports.deleteEventById = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an event by ID
exports.updateEventById = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
