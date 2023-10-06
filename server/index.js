const express = require("express");
const app = express();
const mysql2 = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const dbConfig = {
  user: "root",
  host: "localhost",
  password: "QWEasd123",
  database: "employeesystem",
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

// 生成令牌
const generateToken = (userId) => {
  const payload = { userId };
  const secretKey = "your_secret_key"; // 替换为您自己的密钥
  const options = { expiresIn: "1h" }; // 令牌的有效期限，可以根据需要进行调整
  return jwt.sign(payload, secretKey, options);
};

app.post("/verifyToken", async (req, res) => {
  const token = req.body.token;

  try {
    const decodedToken = jwt.verify(token, "your_secret_key"); // 替换为您自己的密钥

    // 在此处添加根据令牌内容进行其他验证的逻辑

    res.json({ success: true, user: decodedToken.userId });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});


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
        const userId = rows[0].id;
        const token = generateToken(userId);

        res.cookie("token", token, { httpOnly: true }); // 将令牌设置为 cookie
        res.json({
          success: true,
          message: "登录成功",
          user: {
            username: rows[0].username,
            phone: rows[0].phone,
            address: rows[0].address
          }
        });
      } else {
        res.json({ success: false, message: "无效的帐号或密码" });
      }
    } else {
      res.json({ success: false, message: "无效的帐号或密码" });
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
      return res.json({ success: false, message: "用户已存在" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await connection.execute(
        "INSERT INTO userdb (username, password, phone, address) VALUES (?, ?, ?, ?)",
        [username, hashedPassword, phone, address]
      );
      
      const [newUser] = await connection.execute(
        "SELECT * FROM userdb WHERE username = ?",
        [username]
      );
      connection.release();

            res.json({
        success: true,
        message: "成功注册",
        user: {
          username: newUser[0].username,
          phone: newUser[0].phone,
          address: newUser[0].address
        }
      });
    } catch (error) {
      connection.release();
      console.log("Hashing error:", error);
      res
        .status(500)
        .json({ success: false, message: "Error during password hashing" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/user", async (req, res) => {
  // 从请求中获取令牌
  const token = req.cookies.token;

  try {
    const decodedToken = jwt.verify(token, "your_secret_key"); // 替换为您自己的密钥
    const userId = decodedToken.userId;

    const connection = await getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM userdb WHERE id = ?",
      [userId]
    );
    connection.release();

    if (rows.length > 0) {
      const user = rows[0];
      res.json({ success: true, user });
    } else {
      res.json({ success: false, message: "用户不存在" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/products", async (req, res) => {
  const name = req.body.name;
  const price = req.body.price;

  try {
    const connection = await getConnection();

    await connection.execute(
      "INSERT INTO products (name, price) VALUES (?, ?)",
      [name, price]
    );

    connection.release();

    res.json({ success: true, message: "商品添加成功" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "添加商品时出错" });
  }
});

app.listen(3001, () => {
  console.log("Server is running");
});