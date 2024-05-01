// walletController.js
const Wallet = require("../model/Wallet");

// Create Wallet
const createWallet = async (req, res) => {
  try {
    const { userId } = req.body;
    const wallet = new Wallet({ user: userId });
    await wallet.save();
    res.status(201).json(wallet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Wallet Balance
const getWalletBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }
    res.json({ balance: wallet.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update Wallet Balance
const updateWalletBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    wallet.balance += amount;
    wallet.transactions.push({
      type: amount >= 0 ? "topup" : "purchase",
      amount: Math.abs(amount),
    });

    await wallet.save();

    res.json(wallet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Transaction History
const getTransactionHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }
    res.json({ transactions: wallet.transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createWallet,
  getWalletBalance,
  updateWalletBalance,
  getTransactionHistory, // Export the function
};
