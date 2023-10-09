const express = require("express");
const app = express();
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require('bcrypt');

app.use(cors());
app.use(express.json());

let db;  // Declare a variable to store the database connection

const connectToDatabase = async () => {
  try {
    db = await mysql.createConnection({
      user: "root",
      host: "localhost",
      password: "QWEasd123",
      database: "employeesystem",
    });
    console.log("Database connection successful");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

connectToDatabase();  // Connect to the database when the server starts

app.post("/login", async (req, res) => {
  console.log("Received login request:", req.body);
  const { username, password } = req.body;

  try {
    const [rows, fields] = await db.execute("SELECT * FROM userdb WHERE username = ?", [username]);
    if (rows.length === 1) {
      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        res.status(200).send("登入成功");
      } else {
        res.status(401).send("帳號或密碼錯誤");
      }
    } else {
      res.status(404).send("帳號不存在");
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("伺服器出錯");
  }
});



app.post("/createaccount", async (req, res) => {
  const { username, password, nickname, phone, address } = req.body;

  try {
    const [existingUsers] = await db.execute("SELECT * FROM userdb WHERE username = ?", [username]);
    if (existingUsers.length > 0) {
      return res.status(400).send("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO userdb (username, password, nickname, phone, address, createdate) VALUES (?, ?, ?, ?, ?, NOW())",
      [username, hashedPassword, nickname, phone, address]
    );

    res.send("Values Inserted");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error inserting values");
  }
});


app.get("/user", async (req, res) => {
  const { userId } = req.query;

  try {
    const [rows, fields] = await db.execute("SELECT * FROM userdb WHERE id = ?", [userId]);
    res.send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching data");
  }
});


app.listen(3001, () => {
  console.log("Server is running");
});
