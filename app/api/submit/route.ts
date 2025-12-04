import { google } from "googleapis";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { department, year, gender, name, phone, leader, special, attendance, fee, paid } = body;

    const keyPath = path.join(process.cwd(), "form-key.json");
    const keyFile = JSON.parse(fs.readFileSync(keyPath, "utf-8"));

    const auth = new google.auth.GoogleAuth({
      credentials: keyFile,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = "1Rv6W6_UsT_mYg5sygtNkr7jakyIhJWH4dKgnnMldtpo";

    const timestamp = new Date().toISOString();

    // A~U 열 배열
    const values = [
      timestamp, department, year, gender, name, phone, leader, special,
      ...attendance, fee
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "A1",
      valueInputOption: "RAW",
      requestBody: { values: [values] },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
