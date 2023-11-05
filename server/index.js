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
      database: "employeesystem",
    });
    console.log("數據庫連接成功");
  } catch (error) {
    console.error("連接出錯:", error);
  }
};
connectToDatabase();

//登入-login                        
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

//生成帳號-createaccount
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

//取得用戶資料-user
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

//更新用戶-user
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

//刪除用戶-user
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

// 创建订单
app.post("/checkout", async (req, res) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");

  try {
    // 查询当天已经生成的订单数量
    const [orderCountRow] = await db.execute(
      "SELECT COUNT(*) as orderCount FROM orders WHERE createdate LIKE ?",
      [`${year}-${month}-${day}%`]
    );

    const orderCount = orderCountRow[0].orderCount + 1;
    const orderNumber = `${year}${month}${day}${hours}${minutes}${orderCount.toString().padStart(5, '0')}`;

    const { userID, username, cartItems, orderNotes, deliveryMethod, totalAmount } = req.body;

    // 插入订单
    const [result] = await db.execute(
      "INSERT INTO orders (orderNumber, userID, username, totalAmount, deliveryMethod, orderNotes, createdate) VALUES (?, ?, ?, ?, ?, ?, now())",
      [orderNumber, userID, username, totalAmount, deliveryMethod, orderNotes]
    );

    console.log("是否存在cartItems?", cartItems)

    // 遍历购物车中的商品并插入订单商品表
    for (const itemID in cartItems) {
      const item = cartItems[itemID];
      const product = products.find((product) => product.id === Number(itemID));

      console.log("是否存在product?", product)

      if (product) {
        const product_price = product.price;
        const count = item.quantity;
        const totalCost = product_price * count;

        console.log("找到匹配的产品：", product);
        console.log("商品價格:", product_price);
        console.log("數量:", count);
        console.log("單類型產品總值:", totalCost);

        // 将订单商品信息插入数据库
        await db.execute(
          "INSERT INTO order_items (orderNumber, productid, product_price, count, totalCost, deliveryMethod, orderNotes, createdate) VALUES (?, ?, ?, ?, ?, ?, ?, now())",
          [orderNumber, itemID.toString(), product_price, count, totalCost, deliveryMethod, orderNotes]
        );

        // 更新订单总价格
        totalAmount += totalCost;
      }
    }

    // 更新订单总价格
    await db.execute(
      "UPDATE orders SET totalAmount = ? WHERE orderNumber = ?",
      [totalAmount, orderNumber]
    );

    // 提交事务
    await db.commit();

    res.status(200).json({ orderNumber, totalAmount, orderNotes });
  } catch (error) {
    // 如果发生错误，回滚事务
    await db.rollback();
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

//產品查詢-productlist
app.get('/productlist', async (req, res) => {
  try {

    const [rows, fields] = await db.execute("SELECT * FROM productsdb");

    // 将订单数据发送到前端
    res.status(200).json(rows);
  } catch (error) {
    console.error("查询產品时出错:", error);
    res.status(500).json({ error: "暫時沒有產品" });
  }
});


//產品上傳
const path = require('path');
const multer = require('multer');
const uploadDirectory = path.join(__dirname, 'assets'); // 相对于服务器应用程序的根目录
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    // 构建新文件名，将产品ID作为文件名
    const productId = req.body.productid;
    const fileName = `${productId}${path.extname(file.originalname)}`;
    cb(null, fileName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB限制
});
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.post('/productupload', upload.single('picture'), async (req, res) => {
  const { productname, price, detail, storage, userID, sort, status } = req.body;
  const picture = req.file.filename; // 获取上传的文件名，这里已经是产品ID了

  console.log('Parsed values:', productname, price, detail, storage, userID, sort, status);
  console.log('Picture:', picture); // 输出上传的文件名

  try {
    const [result, fields] = await db.execute("INSERT INTO productsdb (productid, productname, price, detail, sort, storage, status, picture, createdate, userID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, now(), ?)",
    [req.body.productid, productname, price, detail, sort, storage, status, picture, userID]);
    
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
