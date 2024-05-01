const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");

// Routes for ticket-related operations

// Get all tickets
router.get("/", ticketController.getAllTickets);

// Create a new ticket
router.post("/", ticketController.createTicket);

// Get a single ticket by ID
router.get("/:id", ticketController.getTicketById);

// Update a ticket by ID
router.put("/:id", ticketController.updateTicketById);

// Delete a ticket by ID
router.delete("/:id", ticketController.deleteTicketById);

module.exports = router;
