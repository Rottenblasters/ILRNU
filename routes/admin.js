const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");
const authMiddleware = require("../middleware/authMiddleware");

// login an admin
router.get("/", async (req, res) => {
  const { email, password } = req.body;

  //check if email is valid
  if (!isEmail(email)) return res.status(401).send("Invalid Email");

  try {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    // check if admin exists
    if (!user) {
      return res.status(401).send("Invalid Credentials");
    }

    // verify password
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).send("Invalid Credentials");
    }

    // generate jwt token
    const payload = { userId: user._id };
    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: "2d" },
      (err, token) => {
        if (err) throw err;
        // setToken(token);
        res.cookie("token", token).status(200).send(token);
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

// Create an admin
router.post("/", async (req, res) => {
  const { email, password, name, phoneNo } = req.body;

  // check if email is valid
  if (!isEmail(email)) return res.status(401).send("Invalid Email");

  try {
    user = new UserModel({
      name,
      email: email.toLowerCase(),
      password,
      phoneNo: phoneNo,
      role: "admin",
    });

    // hash password
    user.password = await bcrypt.hash(password, 10);
    // save admin
    await user.save();

    // generate jwt token
    const payload = { userId: user._id };
    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: "2d" },
      (err, token) => {
        if (err) throw err;
        // setToken(token);
        res.cookie("token", token).status(200).send(token);
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

// Edit an admin password
router.put("/", authMiddleware, async (req, res) => {
  const { userId } = req.body;
  const user = await UserModel.findById(userId).select("+password");
  try {

    // check if admin exists
    if (!user) {
      res.status(500).send("User Not Found");
    }

    const { oldPassword, newPassword } = req.body;
    const isPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isPassword) {
      return res.status(401).send("Invalid Old Password");
    }

    // update the admin data
    updatedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.findByIdAndUpdate(userId, { password: updatedPassword });

    res.status(200).send("Success");
  } catch (error) {
    res.status(500).send(error);
  }
});


// Delete an admin account
router.delete("/", authMiddleware, async (req, res) => {
  const { userId } = req.body;
  const user = await UserModel.findById(userId);
  try {
    if (!user) {
      res.status(500).send("User Not Found");
    }
    // delete admin
    await UserModel.findByIdAndDelete(userId);
    res.clearCookie("token");
    res.status(200).send("Success");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
