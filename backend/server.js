require("dotenv").config();


const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

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
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Access Denied. No Token Provided",
    });
  }

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = verified;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid Token",
    });
  }
};

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
app.get("/products/:id", (req, res) => {
  const id = req.params.id;

  const query =
    "SELECT * FROM products WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Database Error",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(result[0]);
  });
});

app.post(
  "/products",
  verifyToken,
  upload.single("image"),
  (req, res) => {

    const { name, price, category } =
      req.body;

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : null;


const query =
  "INSERT INTO products (name, price, category, image) VALUES (?, ?, ?, ?)";

db.query(
  query,
  [name, price, category,image],
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

app.delete("/products/:id",verifyToken, (req, res) => {
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

app.put("/products/:id",verifyToken,upload.single("image"), (req, res) => {
  const id = req.params.id;

  const { name, price, category } = req.body;
  const image = req.file
  ? `/uploads/${req.file.filename}`
  : null;

  const query =
    "UPDATE products SET name=?, price=?, category=?, image=? WHERE id=?";

  db.query(
    query,
    [name, price, category, image, id],
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
app.post("/signup", (req, res) => {
  console.log("SIGNUP HIT");
  const { name, email, password } =
    req.body;

  const query =
    "INSERT INTO users (name,email,password) VALUES (?,?,?)";

  db.query(
    query,
    [name, email, password],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Email already exists",
        });
      }

      res.json({
        success: true,
        message:
          "User Registered Successfully",
      });
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } =
    req.body;

  const query =
    "SELECT * FROM users WHERE email=?";

  db.query(
    query,
    [email],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Database Error",
        });
      }

      if (result.length === 0) {
        return res.status(401).json({
          success: false,
          message: "User Not Found",
        });
      }

      const user = result[0];

      if (user.password !== password) {
        return res.status(401).json({
          success: false,
          message: "Wrong Password",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.json({
        success: true,
        token,
        user,
      });
    }
  );
});

app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      {
        username: username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      success: true,
      token,
      message: "Login Successful",
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid Credentials",
    });
  }
});

console.log("SIGNUP ROUTE VERSION LOADED");

app.listen(5000, () => {
  console.log("Server running on port 5000");
});