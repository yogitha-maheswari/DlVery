import { Router } from "express";
import {
  getAllDeliveries,
  createDelivery,
  updateDelivery,
  deleteDelivery,
} from "../controllers/deliveryController";

const router = Router();

router.get("/", getAllDeliveries);
router.post("/", createDelivery);
router.put("/", updateDelivery);
router.delete("/", deleteDelivery);

export default router;
