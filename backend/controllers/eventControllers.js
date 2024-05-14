const NodeGeocoder = require("node-geocoder");
const Event = require("../model/Events");
const cloudinary = require("cloudinary").v2;

const options = {
  provider: "google",
  apiKey: "AIzaSyCnqbebQOpYAMedUi-Ct_xKwXmWlMsO_Q4",
};

const geocoder = NodeGeocoder(options);

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

    console.log(req.body, "req.body");
    console.log(file, "file");

    // Upload image to Cloudinary
    const cloudinaryUpload = await cloudinary.uploader.upload(file.path, {
      folder: "event_images", // Optional: set a folder in Cloudinary
    });

    const {
      eventType,
      name,
      startingTime,
      description,
      location,
      category,
      tickets,
      owner,
    } = req.body;

    // Perform geocoding to get coordinates
    geocoder.geocode(location, async function (err, data) {
      if (err || !data.results || data.results.length === 0) {
        return res.status(400).json({ error: "Invalid address" });
      }

      const { lat, lng } = data.results[0].geometry.location;

      // Create a new event with image URL and coordinates
      const newEvent = new Event({
        eventType,
        name,
        startingTime,
        image: cloudinaryUpload.secure_url,
        description,
        category,
        tickets,
        owner,
        location: {
          type: "Point",
          coordinates: [lng, lat],
        },
      });

      console.log(newEvent, "newEvent");

      // Save the event to MongoDB
      const savedEvent = await newEvent.save();

      res.status(201).json(savedEvent);
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
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
