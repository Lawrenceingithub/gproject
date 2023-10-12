const express = require("express");
const app = express();
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require('bcrypt');

app.use(cors());
app.use(express.json());

let db;
const connectToDatabase = async () => {
  try {
    db = await mysql.createConnection({
      user: "root",
      host: "localhost",
      password: "QWEasd123",
      database: "shopdb",
    });
    console.log("數據庫連接成功");
  } catch (error) {
    console.error("連接出錯:", error);
  }
};
connectToDatabase();

app.post("/login", async (req, res) => {
  console.log("連接請求:", req.body);
  const { username, password } = req.body;

  try {
    const [rows, fields] = await db.execute("SELECT * FROM userdb WHERE username = ?", [username]);
    if (rows.length === 1) {
      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        res.status(200).send("登入成功");
        /* res.status(200).json({ user, username }); // 将用户信息包含在响应中  */
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
      return res.status(400).send("用戶名存在");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO userdb (username, password, nickname, phone, address, createdate) VALUES (?, ?, ?, ?, ?, NOW())",
      [username, hashedPassword, nickname, phone, address]
    );

    res.send("注冊成功");
  } catch (error) {
    console.log(error);
    res.status(500).send("未能成功注冊");
    return;
  }
});


app.get("/user", async (req, res) => {
  const { userId } = req.query;

  try {
    const [rows, fields] = await db.execute("SELECT * FROM userdb WHERE id = ?", [userId]);
    res.send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("出錯");
  }
});


app.listen(3001, () => {
  console.log("Server is running");
});
