import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { createPDFReport } from "../utils/pdf.util";
import { OpenAI } from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tableName } = req.body;

    if (!tableName) {
      res.status(400).json({ error: "Missing tableName in request body" });
      return;
    }

    let data: any[] = [];

    switch (tableName) {
      case "Users":
        data = await prisma.users.findMany();
        break;
      case "Products":
        data = await prisma.products.findMany();
        break;
      case "Deliveries":
        data = await prisma.delivery.findMany();
        break;
      case "Sales":
        data = await prisma.sales.findMany();
        break;
      case "Purchases":
        data = await prisma.purchases.findMany();
        break;
      case "Expenses":
        data = await prisma.expenses.findMany();
        break;
      case "SalesSummary":
        data = await prisma.salesSummary.findMany();
        break;
      case "PurchaseSummary":
        data = await prisma.purchaseSummary.findMany();
        break;
      case "ExpenseSummary":
        data = await prisma.expenseSummary.findMany();
        break;
      case "ExpenseByCategory":
        data = await prisma.expenseByCategory.findMany();
        break;
      default:
        res.status(400).json({ error: "Invalid table name" });
        return;
    }

    const prompt = `Analyze the following ${tableName} data and provide a meaningful summary:\n${JSON.stringify(data.slice(0, 20))}`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const analysis = aiResponse.choices[0]?.message?.content || "No analysis generated.";

    const pdfBuffer = await createPDFReport(`${tableName} Report`, analysis, data);

    res.setHeader("Content-Disposition", `attachment; filename=${tableName}-Report.pdf`);
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
