const Contact = require("../model/Contact");
const sendMail = require("../utilities/sendMail");

const contactFormHandler = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Save the form data to the database
  const newContact = new Contact({
    name,
    email,
    message,
  });

  try {
    await newContact.save();

    const mailOptions = {
      email: "swiftcart100@gmail.com", // Replace with your email address
      subject: "New Contact Us Message",
      message: `
        <h1>New Contact Us Message</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { contactFormHandler };
