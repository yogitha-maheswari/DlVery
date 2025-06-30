"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.users.findMany({
            select: {
                userId: true,
                name: true,
                email: true,
                role: true,
                password: false, // ✅ include password
            },
        });
        res.json(users);
    }
    catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({ message: "Error retrieving users" });
    }
});
exports.getUsers = getUsers;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, name, email, role, password } = req.body;
        if (!name || !email || !role || !password) {
            res.status(400).json({ message: "All fields including password are required" });
            return;
        }
        const user = yield prisma.users.create({
            data: { userId, name, email, role, password },
        });
        res.status(201).json({
            userId: user.userId,
            name: user.name,
            email: user.email,
            role: user.role,
            password: user.password, // ✅ include password
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user" });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, name, email, role, password } = req.body;
        if (!userId || !name || !email || !role || !password) {
            res.status(400).json({ message: "All fields including password are required" });
            return;
        }
        const user = yield prisma.users.update({
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
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user" });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body; // ✅ changed from query to body
        if (!userId) {
            res.status(400).json({ message: "Missing userId" });
            return;
        }
        yield prisma.users.delete({
            where: { userId },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user" });
    }
});
exports.deleteUser = deleteUser;
