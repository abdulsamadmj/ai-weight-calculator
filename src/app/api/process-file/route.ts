// src/app/api/process-file/route.ts
import { NextResponse } from "next/server";
import openai from "@/lib/openai";
import * as XLSX from "xlsx";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import os from "os";

const execPromise = promisify(exec);

const referenceDataPath = path.resolve(
  "public/ANSI PIPE SCHEDULE - METRIC_ for GPT - Weight Only.csv"
);
const referenceData = fs.readFileSync(referenceDataPath, "utf8");

export async function POST(req: Request) {
  if (!req.body) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const systemContent = `
    You are an expert in steel equipment. Process the following data and add a "Unit Weight" column before the "Weight" column. Use the provided CSV data to look up wall thickness and weight based on outer diameter (OD) and schedule. Ensure the "Weight" column is correctly updated based on the "Unit Weight" and quantity. At the bottom of the data, add a row labeled "Total Weight (kg)" and sum up the weight column. Return the processed data as a valid JSON array.

    Here is the CSV data: ${referenceData}

    Most importantly this is for an api so respond in pure JSON, no markup or text should be added before or after the result.
    `;

    let messages: ChatCompletionMessageParam[];

    if (file.type.includes("excel") || file.type.includes("spreadsheet")) {
      const content = await processExcel(file);
      messages = [
        {
          role: "system",
          content: systemContent,
        },
        {
          role: "user",
          content: content,
        },
      ];
    } else if (file.type === "application/pdf") {
      const content = await processPDF(file);
      messages = [
        {
          role: "system",
          content: systemContent,
        },
        {
          role: "user",
          content: content,
        },
      ];
    } else if (file.type.includes("image")) {
      const base64Image = Buffer.from(await file.arrayBuffer()).toString(
        "base64"
      );
      messages = [
        {
          role: "system",
          content: systemContent,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: systemContent,
            },
            {
              type: "image_url",
              image_url: { url: `data:${file.type};base64,${base64Image}` },
            },
          ],
        },
      ];
    } else {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      // max_tokens: 4096,
    });

    let processedData = completion.choices[0].message.content;

    if (processedData) {
      // Clean the JSON response
      processedData = cleanJSONResponse(processedData);
    } else {
      throw new Error("Received null response from OpenAI API");
    }

    // Create a new Excel file with the processed data
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(JSON.parse(processedData || "[]"));
    XLSX.utils.book_append_sheet(wb, ws, "Processed Data");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="processed_${file.name}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}

function cleanJSONResponse(response: string): string {
  // Remove unwanted text or markup before and after the JSON
  const startIndex = response.indexOf("[");
  const endIndex = response.lastIndexOf("]") + 1;
  if (startIndex !== -1 && endIndex !== -1) {
    return response.substring(startIndex, endIndex);
  }
  throw new Error("Invalid JSON response");
}

async function processExcel(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  return JSON.stringify(jsonData);
}

async function processPDF(file: File): Promise<string> {
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
}
