require("dotenv").config();


const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "2580@36",
  database: "blinkit_db",
});

db.connect((err) => {
  if (err) {
    console.log("MySQL Connection Error:", err);
  } else {
    console.log("MySQL Connected");
  }
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/products", (req, res) => {
  const query = "SELECT * FROM products";
  
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        message: "Database Error",
      });
    } else {
      res.json(result);
    }
  });
});
app.post("/products", (req, res) => {
const { name, price, category } = req.body;


const query =
  "INSERT INTO products (name, price, category) VALUES (?, ?, ?)";

db.query(
  query,
  [name, price, category],
  (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        message: "Error adding product",
      });
    } else {
      res.json({
        message: "Product added successfully",
      });
    }
  }
);
});

app.delete("/products/:id", (req, res) => {
  const id = req.params.id;

  const query = "DELETE FROM products WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.log(err);

      res.status(500).json({
        message: "Error deleting product",
      });
    } else {
      res.json({
        message: "Product deleted successfully",
      });
    }
  });
});

app.put("/products/:id", (req, res) => {
  const id = req.params.id;

  const { name, price, category } = req.body;

  const query =
    "UPDATE products SET name=?, price=?, category=? WHERE id=?";

  db.query(
    query,
    [name, price, category, id],
    (err, result) => {
      if (err) {
        console.log(err);

        res.status(500).json({
          message: "Error updating product",
        });
      } else {
        res.json({
          message: "Product updated successfully",
        });
      }
    }
  );
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});