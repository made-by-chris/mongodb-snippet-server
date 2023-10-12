import express from "express";
import User from "../models/users.js";
const router = express.Router();

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "There was an error logging in. Please check your credentials." });
  }
  const isMatch = await user.comparePassword(req.body.password);
  if (!isMatch) {
    return res.status(400).json({ message: "There was an error logging in. Please check your credentials." });
  }
  req.session.user = user;
  res.json({ message: "User logged in successfully", data: user });
});

router.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    req.session.user = user;

    res.json({ message: "User created successfully", data: user });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Registration failed - check credentials. Maybe you already have an account?" });
    } else {
      res.status(500).json({ message: error.details[0].message });
    }
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

export default router;
