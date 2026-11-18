import { createRequire } from "module";
import mammoth from "mammoth";

// pdf-parse v1.x exports a plain async function — use createRequire for CJS interop in ESM
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

/**
 * Extract clean plain text from PDF or DOCX file buffer
 * @param {Buffer} buffer - File buffer
 * @param {string} mimetype - File mimetype
 * @param {string} originalname - Original file name
 * @returns {Promise<string>} Clean extracted text
 */
export const extractTextFromResume = async (buffer, mimetype = "", originalname = "") => {
  try {
    if (!buffer || buffer.length === 0) {
      throw new Error("Empty file buffer provided.");
    }

    const lowerName = (originalname || "").toLowerCase();
    const isDocx =
      mimetype.includes("wordprocessingml") ||
      mimetype.includes("msword") ||
      lowerName.endsWith(".docx") ||
      lowerName.endsWith(".doc");

    if (isDocx) {
      // mammoth works perfectly for DOCX/DOC
      const result = await mammoth.extractRawText({ buffer });
      const extractedText = (result?.value || "").trim();
      return extractedText;
    }

    // PDF — pdfParse is a function in v1.x: pdfParse(buffer) -> { text, ... }
    const pdfData = await pdfParse(buffer);
    const extractedText = (pdfData?.text || "").trim();
    return extractedText;

  } catch (error) {
    console.error("Resume parsing error:", error.message);
    throw new Error(`Failed to extract text from resume: ${error.message}`);
  }
};
