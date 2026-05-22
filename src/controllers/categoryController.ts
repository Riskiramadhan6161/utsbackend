import type { Request, Response } from "express";
import { prisma } from "../lib/db.js"; // Sesuaikan dengan jalur file db/prisma client kamu

// 1. GET ALL CATEGORIES
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil kategori", error });
  }
};

// 2. CREATE CATEGORY (Pastikan bagian ini menangkap 'nama')
export const createCategory = async (req: Request, res: Response) => {
  try {
    // 1. Ambil 'nama' dan 'name' sekaligus dari req.body untuk jaga-jaga
    const { nama, name } = req.body; 

    // 2. Gunakan variabel mana pun yang diisi oleh frontend
    const categoryName = nama || name;

    // 3. Validasi: Jika dua-duanya kosong, baru kembalikan error
    if (!categoryName) {
      return res.status(400).json({ message: "Nama kategori (nama/name) wajib diisi" });
    }

    // 4. Simpan ke database menggunakan properti 'nama' sesuai schema.prisma
    const newCategory = await prisma.category.create({
      data: {
        nama: categoryName, 
      },
    });

    return res.status(201).json(newCategory);
  } catch (error: any) {
    // Membantu Anda melihat error asli Prisma di terminal jika database menolak
    console.error("Prisma Error:", error); 

    return res.status(500).json({ 
      message: "Gagal menambah kategori", 
      error: error.message || error 
    });
  }
};

// 3. GET CATEGORY BY ID (Untuk halaman Edit)
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const category = await prisma.category.findUnique({ where: { id } });
    
    if (!category) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil detail kategori", error });
  }
};

// 4. UPDATE CATEGORY BY ID
export const updateCategoryById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nama, name } = req.body; 

    const categoryName = nama || name;

    if (!categoryName) {
      return res.status(400).json({ message: "Nama kategori wajib diisi" });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { 
        nama: categoryName 
      },
    });

    res.json(updatedCategory);
  } catch (error: any) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Gagal memperbarui kategori", error: error.message || error });
  }
};

// 5. DELETE CATEGORY BY ID
export const deleteCategoryById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.category.delete({ where: { id } });
    res.json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus kategori", error });
  }
};