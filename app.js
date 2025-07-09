const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./db");
const User = require("./models/User");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Sync User model
sequelize
  .sync()
  .then(() => {
    console.log("Database synced!");
    app.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
    });
  })
  .catch((err) => {
    console.error("Failed to sync DB :", err);
  });

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.log("Error while fetching data : ", error);
    res.status(400).json(error);
  }
});

// Get user by id
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(parseInt(req.params.id));
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (error) {
    console.log("Error while fetching data : ", error);
    res.status(400).json(error);
  }
});

// Create new user
app.post("/api/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      const field = error.errors[0].path;
      const msg =
        field === "email"
          ? "Email already registered"
          : field === "mobile"
          ? "Mobile number already registered"
          : "Details already registered";
      return res.status(400).json({ message: msg });
    }
    if (error.name === "SequelizeValidationError") {
      const field = error.errors[0].path;
      const msg =
        field === "email"
          ? "Please enter valid email"
          : field === "mobile"
          ? "Please enter valid number"
          : "Please enter correct details";
      return res.status(400).json({ message: msg });
    }
    res.status(400).json(error);
  }
});

// Update user by id
app.put("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(parseInt(req.params.id));
    if (!user) return res.status(404).send("User not found");
    await user.update(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.log("Error while updating user : ", error);
    res.status(400).json(error);
  }
});

// Deleting user data
app.delete("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(parseInt(req.params.id));
    if (!user) return res.status(404).send("User not found");
    await user.destroy();
    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.log("Error while deleting user : ", error);
    res.status(400).json(error);
  }
});
