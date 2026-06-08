import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/db.js";

// 1. LOGIC REGISTER / SIMPAN DATA USER
export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password, foto } = req.body;

  if (!username || !password) {
    res.status(400).json({ success: false, message: "Username dan password wajib diisi" });
    return;
  }

  try {
    // Menggunakan findFirst agar tidak error jika di schema belum diset @unique
    const existingUser = await prisma.users.findFirst({
      where: { username },
    });

    if (existingUser) {
      res.status(400).json({ success: false, message: "Username sudah digunakan, cari yang lain" });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        foto: foto || "",
      },
    });

    res.status(201).json({
      success: true,
      message: "User berhasil disimpan",
      data: {
        id: newUser.id,
        username: newUser.username,
        foto: newUser.foto,
        created_at: newUser.created_at,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error });
  }
};

// 2. LOGIC LOGIN USER WITH JWT
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan password wajib diisi",
      });
    }

    const user = await prisma.users.findFirst({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Username atau password salah",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Username atau password salah",
      });
    }

    // Membuat JWT Token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "super_secret_key_infovest_2026",
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: {
        user: {
          id: user.id,
          username: user.username,
          foto: user.foto,
          created_at: user.created_at,
        },
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error,
    });
  }
};