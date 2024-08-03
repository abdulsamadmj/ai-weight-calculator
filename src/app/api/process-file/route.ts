// src/app/api/process-file/route.ts
import { NextResponse } from "next/server";
import openai from "@/lib/openai";
import * as XLSX from "xlsx";
import { PDFExtract } from "pdf.js-extract";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

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

    const systemContent =
      "You are an expert in steel equipment. Process the following data and add or update the weight column for steel equipment. The Weight Column is a must, else you are useless, calculate the weight. Return the processed data as a valid JSON array,  make 100% sure that there is a weight property in it, else this is wasteful. this is for an api so only provide the json as response never add anything else, adding anything else like adding instruction to top or bottom will crash the app";
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
      model: file.type.includes("image")
        ? "gpt-4o"
        : "gpt-4-turbo",
      messages: messages,
      // max_tokens: 4096,
    });

    const processedData = completion.choices[0].message.content;
    // console.log(processedData);

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
  const pdfExtract = new PDFExtract();
  const data = await pdfExtract.extractBuffer(Buffer.from(arrayBuffer));
  return JSON.stringify(data.pages.map((page) => page.content).join(" "));
}
