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
        // 登录成功，返回用户信息
        res.status(200).json(user);
      } else {
        // 密码错误
        res.status(401).json({ error: "帳號或密碼錯誤" });
      }
    } else {
      // 用户不存在
      res.status(404).json({ error: "帳號不存在" });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "伺服器出錯" });
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
      "INSERT INTO userdb (username, password, nickname, phone, address, createdate, userrole) VALUES (?, ?, ?, ?, ?, NOW(),'0')",
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
  const { username } = req.query; // 使用 userId 查询用户

  try {
    const [rows, fields] = await db.execute("SELECT * FROM userdb WHERE username = ?", [username || null]);
    res.send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("出錯");
  }
});

app.put("/user", async (req, res) => {
  const { userId, nickname, phone, address } = req.body;

  try {
    await db.execute(
      "UPDATE userdb SET nickname = ?, phone = ?, address = ? WHERE userId = ?",
      [nickname, phone, address, userId]
    );
    res.send("更新成功");
  } catch (error) {
    console.log(error);
    res.status(500).send("出错");
  }
});

app.listen(3001, () => {
  console.log("Server is running");
});
