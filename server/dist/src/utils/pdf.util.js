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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPDFReport = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
/**
 * Generates a PDF report and returns it as a Buffer.
 *
 * @param title - Title of the report (e.g. "Users Report")
 * @param analysis - AI-generated analysis text
 * @param data - Array of raw objects (table data)
 * @returns Promise<Buffer> of the generated PDF
 */
const createPDFReport = (title, analysis, data) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = new pdfkit_1.default();
    const buffers = [];
    // Collect PDF chunks
    doc.on("data", (chunk) => buffers.push(chunk));
    // Return full buffer on completion
    const bufferPromise = new Promise((resolve, reject) => {
        doc.on("end", () => resolve(Buffer.concat(buffers)));
        doc.on("error", reject);
    });
    // Title
    doc.fontSize(20).text(title, { align: "center" });
    doc.moveDown();
    // AI Analysis
    doc.fontSize(12).text("AI Analysis:");
    doc.moveDown();
    doc.text(analysis);
    doc.moveDown();
    // Raw Data
    doc.text("Raw Data:");
    doc.moveDown();
    data.forEach((item, i) => {
        doc.text(`${i + 1}. ${JSON.stringify(item, null, 2)}`);
        doc.moveDown();
    });
    doc.end();
    return bufferPromise;
});
exports.createPDFReport = createPDFReport;
