import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

// GET all deliveries
export const getAllDeliveries = async (_req: Request, res: Response) => {
  try {
    const deliveries = await prisma.delivery.findMany({
      include: { product: true, user: true },
    });
    res.status(200).json(deliveries);
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    res.status(500).json({ error: "Failed to fetch deliveries" });
  }
};

// CREATE delivery
export const createDelivery = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      userId,
      productId,
      quantity,
      category,
      address,
      contact,
      deadline,
    } = req.body;

    const product = await prisma.products.findUnique({ where: { productId } });

    if (!product || product.stockQuantity < quantity) {
      res.status(400).json({ error: "Not enough stock" });
      return;
    }

    await prisma.products.update({
      where: { productId },
      data: { stockQuantity: product.stockQuantity - quantity },
    });

    const delivery = await prisma.delivery.create({
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
  } catch (error) {
    console.error("Error assigning delivery:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// UPDATE delivery
export const updateDelivery = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      deliveryId,
      userId,
      productId,
      quantity,
      category,
      address,
      contact,
      deadline,
      status,
    } = req.body;

    const delivery = await prisma.delivery.findUnique({ where: { deliveryId } });
    if (!delivery) {
      res.status(404).json({ error: "Delivery not found" });
      return;
    }

    if (status === "Returned") {
      await prisma.products.update({
        where: { productId },
        data: { stockQuantity: { increment: quantity } },
      });
    } else if (status === "Damaged") {
      await prisma.products.update({
        where: { productId },
        data: { isDamaged: true },
      });
    }

    const updated = await prisma.delivery.update({
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
  } catch (error) {
    console.error("Error updating delivery:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteDelivery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { deliveryId } = req.body;

    const existingDelivery = await prisma.delivery.findUnique({
      where: { deliveryId },
    });

    if (!existingDelivery) {
      res.status(404).json({ message: "Delivery not found" });
      return;
    }

    await prisma.products.update({
      where: { productId: existingDelivery.productId },
      data: {
        stockQuantity: {
          increment: existingDelivery.quantity,
        },
      },
    });

    await prisma.delivery.delete({
      where: { deliveryId },
    });

    res.status(200).json({ message: "Delivery deleted and stock updated" });
  } catch (error) {
    console.error("Delete delivery failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


