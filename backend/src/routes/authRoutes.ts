import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

const ADMIN_PASSWORD = "123456"; // hardcoded - admin
const VIEWER_PASSWORD = "viewer123"; // hardcoded - apenas visualização

router.post("/login", async (req, res) => {
  const { password } = req.body;

  let role: string | null = null;

  if (password === ADMIN_PASSWORD) {
    role = "admin";
  } else if (password === VIEWER_PASSWORD) {
    role = "viewer";
  }

  if (role) {
    const token = jwt.sign({ role }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });
    res.json({ success: true, token, role });
  } else {
    res.status(401).json({ success: false, message: "Invalid password" });
  }
});

export default router;
