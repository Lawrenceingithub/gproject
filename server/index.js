const express = require("express");
const app = express();
const mysql2 = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcrypt");

app.use(cors());
app.use(express.json());

const dbConfig = {
  user: "root",
  host: "localhost",
  password: "QWEasd123",
  database: "employeeSystem",
};

const pool = mysql2.createPool(dbConfig);

const getConnection = async () => {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    throw new Error("Error connecting to the database");
  }
};

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const connection = await getConnection();

    const [rows] = await connection.execute(
      "SELECT * FROM userdb WHERE BINARY username = ? LIMIT 1",
      [username]
    );
    connection.release();

    if (rows.length > 0) {
      const match = await bcrypt.compare(password, rows[0].password);
      if (match) {
        res.json({ success: true, message: "Login successful" });
      } else {
        res.json({ success: false, message: "Invalid username or password" });
      }
    } else {
      res.json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/createaccount", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const phone = req.body.phone;
  const address = req.body.address;

  try {
    const connection = await getConnection();

    const [existingUsers] = await connection.execute(
      "SELECT * FROM userdb WHERE BINARY username = ?",
      [username]
    );

    if (existingUsers.length > 0) {
      return res.json({ success: false, message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.execute(
      "INSERT INTO userdb (username, password, phone, address) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, phone, address]
    );
    connection.release();

    res.send("Value inserted");
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.listen(3001, () => {
  console.log("Server is running");
});