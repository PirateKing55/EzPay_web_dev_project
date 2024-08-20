const { Router } = require("express");
const mongoose = require("mongoose");
const { Account } = require("../db");
const { authMiddleware } = require("../middleware");
const router = Router();

// Get Balance Route
router.get("/balance", authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.userId });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    res.status(200).json({
      balance: account.balance,
    });
  } catch (err) {
    console.error("Error fetching balance:", err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Transfer Route
router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { to, amount } = req.body;

    if (!amount || !to) {
      return res.status(400).json({
        message: "Invalid request parameters",
      });
    }

    const fromAccount = await Account.findOne({ userId: req.userId }).session(session);

    if (!fromAccount) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "From account not found",
      });
    }

    if (fromAccount.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient Balance",
      });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "To account not found",
      });
    }

    await Account.updateOne(
      { userId: req.userId },
      {
        $inc: {
          balance: -amount,
        },
      }
    ).session(session);

    await Account.updateOne(
      { userId: to },
      {
        $inc: {
          balance: amount,
        },
      }
    ).session(session);

    await session.commitTransaction();
    res.status(200).json({
      message: "Transfer successful",
    });
  } catch (err) {
    await session.abortTransaction();
    console.error("Error during transfer:", err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  } finally {
    session.endSession();
  }
});

module.exports = router;
