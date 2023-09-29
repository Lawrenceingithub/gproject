const express = require("express");
const app = express();
const mysql2 = require("mysql2");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql2.createConnection({
  user: "root",
  host: "localhost",
  password: "QWEasd123",
  database: "employeeSystem",
});



app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM userdb WHERE username = ? AND password = ? LIMIT 1",
    [username, password],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      } else {
        if (result.length > 0) {
          // 配對成功，回傳成功訊息給前端
          res.json({ success: true, message: "Login successful" });
        } else {
          // 配對失敗，回傳失敗訊息給前端
          res.json({ success: false, message: "Invalid username or password" });
        }
      }
    }
  );
});

app.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "INSERT INTO userdb (username, password) VALUE(?,?)",
    [username, password],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Value insert");
      }
    }
  );
});

app.listen(3001, () => {
  console.log("server is running");
});
