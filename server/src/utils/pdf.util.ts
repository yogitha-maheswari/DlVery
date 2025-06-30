import PDFDocument from "pdfkit";

/**
 * Generates a PDF report and returns it as a Buffer.
 *
 * @param title - Title of the report (e.g. "Users Report")
 * @param analysis - AI-generated analysis text
 * @param data - Array of raw objects (table data)
 * @returns Promise<Buffer> of the generated PDF
 */
export const createPDFReport = async (
  title: string,
  analysis: string,
  data: any[]
): Promise<Buffer> => {
  const doc = new PDFDocument();
  const buffers: Buffer[] = [];

  // Collect PDF chunks
  doc.on("data", (chunk) => buffers.push(chunk));

  // Return full buffer on completion
  const bufferPromise = new Promise<Buffer>((resolve, reject) => {
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
};
