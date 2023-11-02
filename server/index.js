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
  const { username, password } = req.body;
  console.log("連接請求:", req.body);

  try {
    const [rows, fields] = await db.execute("SELECT * FROM userdb WHERE username = ?", [username]);
    if (rows.length === 1) {
      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // 登录成功，返回用户信息，包括 userId 和 userrole
        res.status(200).json({
          userID: user.userID,
          username: user.username,
          nickname: user.nickname,
          phone: user.phone,
          address: user.address,
          userrole: user.userrole // 确保包括 userrole
        });
        console.log([user]);
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
  console.log(req.body)
  try {
    const [existingUsers] = await db.execute("SELECT * FROM userdb WHERE username = ?", [username]);

    if (existingUsers.length > 0) {
      // 用户已存在
      return res.status(400).json({ error: "用戶已存在" });
    }

    if (!username || !password || !nickname || !phone || !address) {
      // 缺少信息
      return res.status(404).json({ error: "請填寫所有信息" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO userdb (username, password, nickname, phone, address, createdate, userrole) VALUES (?, ?, ?, ?, ?, NOW(),'0')",
      [username, hashedPassword, nickname, phone, address]
    );

    // 注册成功后，返回用户ID
    const [user] = await db.execute("SELECT userID FROM userdb WHERE username = ?", [username]);
    const userID = user[0].userID;

    res.status(200).json({ userID, username, nickname, phone, address });
    console.log(req.body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "伺服器出錯" });
  }
});

//取得用戶資料
app.get("/user", async (req, res) => {
  const { userID } = req.query;

  try {
    const query = `SELECT username, nickname, phone, address, userrole FROM userdb WHERE userID = ?`;
    const [rows, fields] = await db.execute(query, [userID]);
    res.send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("查询用户数据时发生错误");
  }
});

//更新用戶
app.put("/user", async (req, res) => {
  const { userID, nickname, phone, address } = req.body;

  try {
    const params = [nickname || null, phone || null, address || null];
    console.log("Received userID:", userID);
    console.log("Received nickname:", nickname);
    console.log("Received phone:", phone);
    console.log("Received address:", address);
    await db.execute(
      "UPDATE userdb SET nickname = ?, phone = ?, address = ? WHERE userID = ?",
      [...params, userID]
    );
    res.send("更新成功");
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("出错：" + error.message);
  }
});

//刪除用戶
app.delete("/user", async (req, res) => {
  const { userID } = req.query;
  console.log("Received userID for delete:", userID);

  try {
    await db.execute("DELETE FROM userdb WHERE userID = ?", [userID]);

    res.status(200).json({ message: "用户删除成功" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "删除用户时出错" });
  }
});

//创建订单
app.post("/checkout", async (req, res) => {
  const { userID, username, cartItems, orderNotes, deliveryMethod } = req.body; // 添加 orderNotes 和 deliveryMethod
  console.log(orderNotes)
  console.log(deliveryMethod)
  let totalAmount = 0;
  let orderID;

  try {

    const [result] = await db.execute(
      "INSERT INTO orders (userID, username, total_price, orderNotes, createdate, deliveryMethod) VALUES (?, ?, ?, ?, now(), ?)", // 更新 SQL 查询以包括配送方式
      [userID, username, totalAmount, orderNotes, deliveryMethod] // 添加 orderNotes 和 deliveryMethod
    );
    // 获取生成的订单ID
    orderID = result.insertId;

    // 遍历购物车中的商品并插入订单商品表
    for (const itemID in cartItems) {
      const item = cartItems[itemID];
      const product = PRODUCTS.find((product) => product.id === Number(itemID));

      if (product) {
        const product_price = product.price;
        const count = item.quantity;
        const itemTotal = product_price * count;

        // 将订单商品信息插入数据库
        await db.execute(
          "INSERT INTO order_items (orderID, productID, product_price, count, total_price) VALUES (?, ?, ?, ?, ?)",
          [orderID, itemID, product_price, count, itemTotal]
        );

        // 更新订单总价格
        totalAmount += itemTotal;
      }
    }

    // 更新订单总价格
    await db.execute(
      "UPDATE orders SET total_price = ? WHERE orderID = ?",
      [totalAmount, orderID]
    );

    res.status(200).json({ orderID, totalAmount });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "创建订单时出错" });
  }
});


// 查询订单数据
app.get("/orderhistory", async (req, res) => {
  try {

    const [rows, fields] = await db.execute("SELECT * FROM orders");

    // 将订单数据发送到前端
    res.status(200).json(rows);
  } catch (error) {
    console.error("查询订单时出错:", error);
    res.status(500).json({ error: "查询订单时出错" });
  }
});


const path = require('path');

const uploadDirectory = path.join(__dirname, 'assets'); // 相对于服务器应用程序的根目录
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB限制
});

app.post('/productupload', upload.single('picture'), async (req, res) => {
  const { productname, price, detail, storage, userID, sort, status, picture } = req.body;

  console.log('Parsed values:', productname, price, detail, storage, userID, sort, status);
  console.log('Picture:', picture); // 输出上传的文件内容

  try {
    const [result, fields] = await db.execute("INSERT INTO productsdb (productname, price, detail, sort, storage, status, picture, createdate, userID) VALUES (?, ?, ?, ?, ?, ?, ?, now(), ?)",
    [productname, price, detail, sort, storage, status, picture , userID]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Product uploaded successfully' });
    } else {
      console.error('Error inserting product into the database');
      res.status(500).json({ error: 'Error inserting product into the database' });
    }
    
  } catch (error) {
    console.error('Error uploading product:', error);
    res.status(500).send('Error uploading product');
  }
});


app.listen(3001, () => {
  console.log("Server is running");
});
