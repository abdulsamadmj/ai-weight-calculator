// src/app/api/process-file/route.ts
import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { helperFunctions } from "@/utils/Helpers";

const referenceDataPath = path.resolve(
  "public/ANSI PIPE SCHEDULE - METRIC_ for GPT - Weight Only.csv"
);
const referenceData = fs.readFileSync(referenceDataPath, "utf8");
const systemContent = `
    You are an expert in steel equipment. Process the following data and add a "Unit Weight" column and "Weight" column. Use the provided CSV data to look up wall thickness and weight based on outer diameter (OD) and schedule. Ensure the "Weight" column is correctly updated based on the "Unit Weight" and quantity. At the bottom of the data, add a row labeled "Total Weight (kg)" and sum up the weight column. It is crucial to distinguish between schedules with 'S' (e.g., 40S) and regular schedules (e.g., 40) and match them exactly as provided in the CSV data. Return the processed data as a valid JSON array.

    Here is the CSV data: ${referenceData}

    Most importantly, this is for an API, so respond in pure JSON Array (eg: [{},{},{}]); no markup or text should be added before or after the result.
    `;

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

    let messages: ChatCompletionMessageParam[];

    if (file.type.includes("excel") || file.type.includes("spreadsheet")) {
      const content = await helperFunctions.processExcel(file);
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
    } else if (file.type.includes("csv")) {
      const content = await helperFunctions.processCSV(file);
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
      const content = await helperFunctions.processPDF(file);
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

    const excelBuffer = await helperFunctions.gptApiToFile(messages);

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

export async function GET(req: NextRequest) {
  // console.log();
  // return NextResponse.json({ error: "Hi" }, { status: 500 });
  const textContent = req.nextUrl.searchParams.get("message");
  if (textContent == null) {
    return NextResponse.json({ error: "No Message Uploaded" }, { status: 400 });
  } else {
    try {
      const messages: ChatCompletionMessageParam[] = [
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
              type: "text",
              text: textContent,
            },
          ],
        },
      ];
      const excelBuffer = await helperFunctions.gptApiToFile(messages);

      return new NextResponse(excelBuffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="calculated_weight.xlsx"`,
        },
      });
    } catch (error) {
      console.error("Error processing file:", error);
      return NextResponse.json(
        { error: "Error processing file" },
        { status: 500 }
      );
    }
  }
}
