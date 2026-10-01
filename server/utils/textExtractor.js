import { createRequire } from "module";
import mammoth from "mammoth";

const require = createRequire(import.meta.url);

/**
 * Robust Text Extractor for PDF, DOCX, and TXT files
 */
export async function extractTextFromBuffer(buffer, fileType, originalName = "document") {
  const ext = (fileType || originalName.split(".").pop() || "").toLowerCase();

  try {
    if (ext.includes("pdf")) {
      const pdfModule = require("pdf-parse");
      let extracted = "";
      let numPages = 1;

      if (typeof pdfModule === "function") {
        const data = await pdfModule(buffer);
        extracted = data.text || "";
        numPages = data.numpages || 1;
      } else if (pdfModule.PDFParse) {
        try {
          const parser = new pdfModule.PDFParse({ data: buffer });
          if (parser.load) await parser.load();
          if (parser.getText) {
            const res = await parser.getText();
            extracted = typeof res === "string" ? res : res?.text || "";
          }
        } catch (clsErr) {
          console.warn("PDFParse class parsing fallback:", clsErr.message);
        }
      }

      // If binary stream contains ASCII text, parse text streams as robust fallback
      if (!extracted) {
        const rawString = buffer.toString("binary");
        const streamMatches = rawString.match(/\(([^)]+)\)\s*Tj/g);
        if (streamMatches) {
          extracted = streamMatches
            .map(m => m.replace(/^\(/, "").replace(/\)\s*Tj$/, ""))
            .join(" ");
        } else {
          // General clean text extraction from printable ASCII
          extracted = rawString.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ");
        }
      }

      return {
        success: true,
        text: cleanExtractedText(extracted),
        numPages,
        fileType: "pdf"
      };
    }

    if (ext.includes("docx") || ext.includes("word") || ext.includes("document")) {
      const result = await mammoth.extractRawText({ buffer });
      return {
        success: true,
        text: cleanExtractedText(result.value || ""),
        messages: result.messages,
        fileType: "docx"
      };
    }

    // Default to plain text (TXT / MD / CSV / JSON)
    const text = buffer.toString("utf8");
    return {
      success: true,
      text: cleanExtractedText(text),
      fileType: "txt"
    };
  } catch (error) {
    console.error(`Error extracting text from ${originalName} (${ext}):`, error);
    throw new Error(`Failed to extract text from ${originalName}: ${error.message}`);
  }
}

/**
 * Clean and normalize extracted whitespace and strange binary artifacts
 */
export function cleanExtractedText(rawText) {
  if (!rawText) return "";
  return rawText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
