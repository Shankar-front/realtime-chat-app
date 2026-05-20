const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const router = express.Router();

const db = require("../db");



// REGISTER
router.post("/register", async (req, res) => {

  try {

    const { username, password } =
      req.body;


    // VALIDATION
    if (!username || !password) {

      return res.status(400).json({
        message: "All fields required"
      });

    }


    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);


    try {

      // INSERT USER
      db.prepare(`
        INSERT INTO users
        (username, password)
        VALUES (?, ?)
      `).run(
        username,
        hashedPassword
      );


      res.json({
        success: true,
        message: "User registered"
      });

    } catch (err) {

      return res.status(400).json({
        message: "User already exists"
      });

    }

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }

});




// LOGIN
router.post("/login", async (req, res) => {

  try {

    const { username, password } =
      req.body;


    // FIND USER
    const user = db.prepare(`
      SELECT *
      FROM users
      WHERE username = ?
    `).get(username);


    // USER NOT FOUND
    if (!user) {

      return res.status(400).json({
        message: "Invalid credentials"
      });

    }


    // CHECK PASSWORD
    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!validPassword) {

      return res.status(400).json({
        message: "Invalid credentials"
      });

    }


    // CREATE JWT TOKEN
    const token = jwt.sign(
      { id: user.id },
      "secretkey",
      { expiresIn: "1d" }
    );


    // RESPONSE
    res.json({
      token,
      username: user.username
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }

});


module.exports = router;