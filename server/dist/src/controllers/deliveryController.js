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
exports.deleteDelivery = exports.updateDelivery = exports.createDelivery = exports.getAllDeliveries = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
// GET all deliveries
const getAllDeliveries = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliveries = yield prisma.delivery.findMany({
            include: { product: true, user: true },
        });
        res.status(200).json(deliveries);
    }
    catch (error) {
        console.error("Error fetching deliveries:", error);
        res.status(500).json({ error: "Failed to fetch deliveries" });
    }
});
exports.getAllDeliveries = getAllDeliveries;
// CREATE delivery
const createDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId, quantity, category, address, contact, deadline, } = req.body;
        const product = yield prisma.products.findUnique({ where: { productId } });
        if (!product || product.stockQuantity < quantity) {
            res.status(400).json({ error: "Not enough stock" });
            return;
        }
        yield prisma.products.update({
            where: { productId },
            data: { stockQuantity: product.stockQuantity - quantity },
        });
        const delivery = yield prisma.delivery.create({
            data: {
                userId,
                productId,
                quantity,
                category,
                address,
                contact,
                deadline: new Date(deadline),
                status: "Pending", // ✅ Explicitly include status
            },
        });
        res.status(201).json(delivery);
    }
    catch (error) {
        console.error("Error assigning delivery:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.createDelivery = createDelivery;
// UPDATE delivery
const updateDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deliveryId, userId, productId, quantity, category, address, contact, deadline, status, } = req.body;
        const delivery = yield prisma.delivery.findUnique({ where: { deliveryId } });
        if (!delivery) {
            res.status(404).json({ error: "Delivery not found" });
            return;
        }
        if (status === "Returned") {
            yield prisma.products.update({
                where: { productId },
                data: { stockQuantity: { increment: quantity } },
            });
        }
        else if (status === "Damaged") {
            yield prisma.products.update({
                where: { productId },
                data: { isDamaged: true },
            });
        }
        const updated = yield prisma.delivery.update({
            where: { deliveryId },
            data: {
                userId,
                productId,
                quantity,
                category,
                address,
                contact,
                deadline: new Date(deadline),
                status,
            },
        });
        res.status(200).json(updated);
    }
    catch (error) {
        console.error("Error updating delivery:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.updateDelivery = updateDelivery;
const deleteDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deliveryId } = req.body;
        const existingDelivery = yield prisma.delivery.findUnique({
            where: { deliveryId },
        });
        if (!existingDelivery) {
            res.status(404).json({ message: "Delivery not found" });
            return;
        }
        yield prisma.products.update({
            where: { productId: existingDelivery.productId },
            data: {
                stockQuantity: {
                    increment: existingDelivery.quantity,
                },
            },
        });
        yield prisma.delivery.delete({
            where: { deliveryId },
        });
        res.status(200).json({ message: "Delivery deleted and stock updated" });
    }
    catch (error) {
        console.error("Delete delivery failed:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteDelivery = deleteDelivery;
