const { Router } = require("express");
const jwt = require("jsonwebtoken");
const { signupBody, signinBody, updatedBody } = require("../schema");
const { JWT_SECRET } = require("../config");
const { findOne, create } = require("mongoose");
const { User, Account } = require("../db");
const { authMiddleware } = require("../middleware");
const router = Router();

router.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect Inputs",
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken",
    });
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  const userId = user._id;

  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000,
  });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);

  res.json({
    message: "User created successfully",
    token: token,
    firstName: user.firstName,
  });
});

router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect Inputs",
    });
  }

  const user = await User.findOne({
    username: req.body.username,
  });

  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );

    res.json({
      token: token,
      firstName: user.firstName,
    });

    return;
  }

  if (!user) {
    res.status(411).json({
      message: "Incorrect username or password",
    });
  }

  res.status(411).json({
    message: "something went wrong while signing in",
  });
});

router.put("/", authMiddleware, async (req, res) => {
  const { success } = updatedBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect Inputs",
    });
  }

  const response = await User.updateOne({ _id: req.userId }, req.body);

  if (!response.acknowledged) {
    res.status(411).json({
      message: "something went wrong",
    });
  }

  res.json({
    message: "updated successfully",
  });
});

router.get("/bulk", authMiddleware, async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = router;
