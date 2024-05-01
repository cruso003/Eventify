const cloudinary = require("cloudinary").v2;
const Event = require("../model/Events");

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
    const { type, title, startingTime, description } = req.body;
    const file = req.file; // Assuming Multer has saved the file

    // Upload image to Cloudinary
    const cloudinaryUpload = await cloudinary.uploader.upload(file.path, {
      folder: "event_images", // Optional: set a folder in Cloudinary
    });

    // Create a new event with Cloudinary image URL
    const newEvent = new Event({
      type,
      title,
      startingTime,
      image: cloudinaryUpload.secure_url,
      description,
    });

    // Save the event to MongoDB
    const savedEvent = await newEvent.save();

    res.status(201).json(savedEvent);
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
