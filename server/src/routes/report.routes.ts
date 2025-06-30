import express from "express";
import { generateReport } from "../controllers/report.controller";

const router = express.Router();

router.post("/", generateReport);

export default router;
