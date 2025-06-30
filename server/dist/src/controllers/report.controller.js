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
exports.generateReport = void 0;
const prisma_1 = require("../../generated/prisma");
const pdf_util_1 = require("../utils/pdf.util");
const openai_1 = require("openai");
const prisma = new prisma_1.PrismaClient();
const openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const generateReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { tableName } = req.body;
        if (!tableName) {
            res.status(400).json({ error: "Missing tableName in request body" });
            return;
        }
        let data = [];
        switch (tableName) {
            case "Users":
                data = yield prisma.users.findMany();
                break;
            case "Products":
                data = yield prisma.products.findMany();
                break;
            case "Deliveries":
                data = yield prisma.delivery.findMany();
                break;
            case "Sales":
                data = yield prisma.sales.findMany();
                break;
            case "Purchases":
                data = yield prisma.purchases.findMany();
                break;
            case "Expenses":
                data = yield prisma.expenses.findMany();
                break;
            case "SalesSummary":
                data = yield prisma.salesSummary.findMany();
                break;
            case "PurchaseSummary":
                data = yield prisma.purchaseSummary.findMany();
                break;
            case "ExpenseSummary":
                data = yield prisma.expenseSummary.findMany();
                break;
            case "ExpenseByCategory":
                data = yield prisma.expenseByCategory.findMany();
                break;
            default:
                res.status(400).json({ error: "Invalid table name" });
                return;
        }
        const prompt = `Analyze the following ${tableName} data and provide a meaningful summary:\n${JSON.stringify(data.slice(0, 20))}`;
        const aiResponse = yield openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
        });
        const analysis = ((_b = (_a = aiResponse.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || "No analysis generated.";
        const pdfBuffer = yield (0, pdf_util_1.createPDFReport)(`${tableName} Report`, analysis, data);
        res.setHeader("Content-Disposition", `attachment; filename=${tableName}-Report.pdf`);
        res.setHeader("Content-Type", "application/pdf");
        res.send(pdfBuffer);
    }
    catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.generateReport = generateReport;
