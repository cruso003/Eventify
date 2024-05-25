const express = require("express");
const contactController = require("../controllers/contactController");
const router = express.Router();

// POST route to handle contact form submissions
router.post("/", contactController.contactFormHandler);

module.exports = router;
