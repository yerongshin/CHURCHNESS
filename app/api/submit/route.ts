import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { department, year, gender, name, phone, leader, special, attendance, fee, paid } = body;

    if (!process.env.GOOGLE_SERVICE_KEY) {
      throw new Error("GOOGLE_SERVICE_KEY 환경변수가 없습니다.");
    }

    // Vercel 환경변수에서 직접 JSON 파싱
    const keyFile = JSON.parse(process.env.GOOGLE_SERVICE_KEY);

    const auth = new google.auth.GoogleAuth({
      credentials: keyFile,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = "1Rv6W6_UsT_mYg5sygtNkr7jakyIhJWH4dKgnnMldtpo";

    const timestamp = new Date().toISOString();
    const values = [
      timestamp,
      department,
      year,
      gender,
      name,
      phone,
      leader,
      special,
      ...attendance,
      fee,
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
