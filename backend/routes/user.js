const { Router } = require("express");
const jwt = require("jsonwebtoken");
const { signupBody, signinBody, updatedBody } = require("../schema");
const { JWT_SECRET } = require("../config");
const { User, Account } = require("../db");
const { authMiddleware } = require("../middleware");
const router = Router();

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { success, error } = signupBody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Incorrect Inputs",
        errors: error.errors,
      });
    }

    if (req.body.username.length < 3 || req.body.username.length > 30) {
      return res.status(400).json({
        message: "Username should be between 3 and 30 characters",
      });
    }

    if (req.body.password.length < 6) {
      return res.status(400).json({
        message: "Password should be atleast 6 characters",
      });
    }

    const existingUser = await User.findOne({
      username: req.body.username,
    });

    if (existingUser) {
      return res.status(409).json({
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

    res.status(201).json({
      message: "User created successfully",
      token: token,
      firstName: user.firstName,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Signin Route
router.post("/signin", async (req, res) => {
  try {
    const { success, error } = signinBody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Incorrect Inputs",
        errors: error.errors,
      });
    }

    const user = await User.findOne({
      username: req.body.username,
    });

    if (!user) {
      return res.status(401).json({
        message: "Incorrect username or password",
      });
    }

    // Password validation logic should be added here
    // For example, compare hashed passwords

    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );

    res.status(200).json({
      token: token,
      firstName: user.firstName,
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Update User Route
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { success, error } = updatedBody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Incorrect Inputs",
        errors: error.errors,
      });
    }

    const response = await User.updateOne({ _id: req.userId }, req.body);

    if (response.matchedCount === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (response.modifiedCount === 0) {
      return res.status(400).json({
        message: "No changes made",
      });
    }

    res.status(200).json({
      message: "Updated successfully",
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Bulk Get Users Route
router.get("/bulk", authMiddleware, async (req, res) => {
  try {
    const filter = req.query.filter || "";

    const users = await User.find({
      $or: [
        {
          firstName: {
            $regex: filter,
            $options: "i", // case insensitive
          },
        },
        {
          lastName: {
            $regex: filter,
            $options: "i", // case insensitive
          },
        },
      ],
    });

    res.status(200).json({
      users: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  } catch (err) {
    console.error("Bulk get users error:", err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
