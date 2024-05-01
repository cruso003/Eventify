const express = require("express");
const router = express.Router();
const config = require("config");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(config.get("stripe"));

// Configuration and constants
const subscriptionKey = config.get("subscriptionKey");
const targetEnvironment = config.get("targetEnvironment"); // E.g., "sandbox" or "production"
const providerCallbackHost = config.get("providerCallbackHost"); // Your callback host
const momoHost = config.get("momoHost");

// Functions for MTN Mobile Money API

// Create API user and key functions
const createApiUser = async () => {
  // Use the provided function to create API user and return its ID
  const xReferenceId = uuidv4();
  const apiUserUrl = `https://${momoHost}/v1_0/apiuser`;

  const headers = {
    "Content-Type": "application/json",
    "X-Reference-Id": xReferenceId,
    "Ocp-Apim-Subscription-Key": subscriptionKey,
    targetEnvironment: targetEnvironment,
  };

  const data = {
    providerCallbackHost: providerCallbackHost,
  };

  try {
    const response = await axios.post(apiUserUrl, data, {
      headers: headers,
    });
    return xReferenceId;
  } catch (error) {
    console.error("Error creating API user:", error);
    throw error;
  }
};

const createApiKey = async (apiUserId) => {
  // Use the provided function to create an API key for the given API user ID
  const apiKeyUrl = `https://${momoHost}/v1_0/apiuser/${apiUserId}/apikey`;
  const headers = {
    "Ocp-Apim-Subscription-Key": subscriptionKey,
  };

  try {
    const response = await axios.post(apiKeyUrl, null, { headers: headers });
    return response.data.apiKey;
  } catch (error) {
    console.error("Error creating API key:", error);
    throw error;
  }
};

// Fetch access token
const fetchAccessToken = async (apiUserId, apiKey) => {
  const momoTokenUrl = `https://${momoHost}/collection/token/`;

  const headers = {
    "Content-Type": "application/json",
    "Ocp-Apim-Subscription-Key": subscriptionKey,
    Authorization: `Basic ${Buffer.from(`${apiUserId}:${apiKey}`).toString(
      "base64"
    )}`,
  };

  try {
    const response = await axios.post(momoTokenUrl, null, {
      headers: headers,
    });
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }
};

// Function to handle request-to-pay
const requestToPay = async (momoToken, xReferenceId, total, phone) => {
  const momoPayUrl = `https://${momoHost}/collection/v1_0/requesttopay`;
  const body = {
    amount: total,
    currency: "EUR",
    externalId: uuidv4(),
    payer: {
      partyIdType: "MSISDN",
      partyId: phone,
    },
    payerMessage: "Payment for order",
    payeeNote: "Thank you for your order",
  };

  const headers = {
    "X-Reference-Id": xReferenceId, // Use the xReferenceId passed from createApiUser
    "X-Target-Environment": targetEnvironment,
    "Ocp-Apim-Subscription-Key": subscriptionKey,
    "Content-Type": "application/json",
    Authorization: `Bearer ${momoToken}`,
  };

  try {
    const response = await axios.post(momoPayUrl, body, { headers: headers });
    // Check response status code
    if (response.status === 202) {
      return response.data;
    } else {
      console.error(`Unexpected response status: ${response.status}`);
      throw new Error(`Request failed with status code ${response.status}`);
    }
  } catch (error) {
    console.error("Error making request-to-pay:", error);
    throw error;
  }
};

// Endpoint for processing payment
router.post("/request-to-pay", async (req, res) => {
  try {
    // Extract payment data from request body
    const { total, phone } = req.body;

    // Create API user and key if not already created
    const xReferenceId = await createApiUser(); // Store the xReferenceId

    // Create API key using the returned xReferenceId
    const apiKey = await createApiKey(xReferenceId);

    // Fetch access token using the API user ID and API key
    const momoToken = await fetchAccessToken(xReferenceId, apiKey); // Pass the xReferenceId to fetchAccessToken

    // Make request-to-pay with the fetched token and xReferenceId
    const momoResponse = await requestToPay(
      momoToken,
      xReferenceId,
      total,
      phone
    );

    // Return successful response to the client
    res.json({ success: true, data: momoResponse });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({
      error: "An error occurred while processing the payment",
    });
  }
});

// Stripe payment intent endpoint
router.post("/intents", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ paymentIntent: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

module.exports = router;
