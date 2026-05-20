const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const db = require("../db");


// REGISTER
router.post("/register", async (req, res) => {

  try {

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `
      INSERT INTO users(username, password)
      VALUES (?, ?)
      `,
      [username, hashedPassword],

      function(err) {

        if (err) {
          return res.status(400).json({
            message: "User already exists"
          });
        }

        res.json({
          success: true,
          message: "User registered"
        });

      }
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }

});


// LOGIN
router.post("/login", (req, res) => {

  try {

    const { username, password } = req.body;

    db.get(
      `
      SELECT * FROM users
      WHERE username = ?
      `,
      [username],

      async (err, user) => {

        if (!user) {
          return res.status(400).json({
            message: "Invalid credentials"
          });
        }

        const validPassword = await bcrypt.compare(
          password,
          user.password
        );

        if (!validPassword) {
          return res.status(400).json({
            message: "Invalid credentials"
          });
        }

        const token = jwt.sign(
          { id: user.id },
          "secretkey",
          { expiresIn: "1d" }
        );

        res.json({
          token,
          username: user.username
        });

      }
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }

});


module.exports = router;