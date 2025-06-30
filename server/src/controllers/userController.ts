import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.users.findMany({
      select: {
        userId: true,
        name: true,
        email: true,
        role: true,
        password: false, // ✅ include password
      },
    });
    res.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "Error retrieving users" });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, name, email, role, password } = req.body;

    if (!name || !email || !role || !password) {
      res.status(400).json({ message: "All fields including password are required" });
      return;
    }

    const user = await prisma.users.create({
      data: { userId, name, email, role, password },
    });

    res.status(201).json({
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      password: user.password, // ✅ include password
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId, name, email, role, password } = req.body;

    if (!userId || !name || !email || !role || !password) {
      res.status(400).json({ message: "All fields including password are required" });
      return;
    }

    const user = await prisma.users.update({
      where: { userId },
      data: { name, email, role, password },
    });

    res.json({
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      password: user.password, // ✅ include password
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;  // ✅ changed from query to body

    if (!userId) {
      res.status(400).json({ message: "Missing userId" });
      return;
    }

    await prisma.users.delete({
      where: { userId },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};
