import * as XLSX from "xlsx";
import os from "os";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import openai from "@/lib/openai";

const execPromise = promisify(exec);

export const helperFunctions = {
  cleanJSONResponse: (response: string): string => {
    // Remove unwanted text or markup before and after the JSON
    const startIndex = response.indexOf("[");
    const endIndex = response.lastIndexOf("]") + 1;
    if (startIndex !== -1 && endIndex !== -1) {
      return response.substring(startIndex, endIndex);
    }
    throw new Error("Invalid JSON response");
  },

  processExcel: async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    return JSON.stringify(jsonData);
  },

  processPDF: async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `${Date.now()}.pdf`);
    const outputCsvPath = path.join(tempDir, `${Date.now()}.csv`);
    fs.writeFileSync(tempFilePath, Buffer.from(arrayBuffer));

    try {
      await execPromise(
        `python scripts/pdf_to_csv.py ${tempFilePath} ${outputCsvPath}`
      );
      const csvData = fs.readFileSync(outputCsvPath, "utf-8");
      return csvData;
    } catch (err) {
      console.error("Error extracting tables from PDF:", err);
      throw new Error("Error extracting tables from PDF");
    } finally {
      fs.unlinkSync(tempFilePath); // Clean up temporary file
      fs.unlinkSync(outputCsvPath); // Clean up temporary file
    }
  },

  gptApiToFile: async (
    messages: ChatCompletionMessageParam[]
  ): Promise<any> => {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      // max_tokens: 4096,
    });

    let processedData = completion.choices[0].message.content;

    if (processedData) {
      // Clean the JSON response
      processedData = helperFunctions.cleanJSONResponse(processedData);
    } else {
      throw new Error("Received null response from OpenAI API");
    }

    // Create a new Excel file with the processed data
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(JSON.parse(processedData || "[]"));
    XLSX.utils.book_append_sheet(wb, ws, "Processed Data");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    return excelBuffer;
  },
};
