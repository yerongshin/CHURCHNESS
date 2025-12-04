import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { department, year, gender, name, phone, leader, special, attendance, fee, paid } = body;

    // 환경변수에서 서비스 계정 키 읽기
    const keyFile = JSON.parse(process.env.GOOGLE_SERVICE_KEY || '{}');

    const auth = new google.auth.GoogleAuth({
      credentials: keyFile,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = "1Rv6W6_UsT_mYg5sygtNkr7jakyIhJWH4dKgnnMldtpo"; // 시트 ID

    // A열: 타임스탬프
    const timestamp = new Date().toISOString();

    // 최종 값 배열 (A~U)
    const values = [
      timestamp,        // A
      department,       // B
      year,             // C
      gender,           // D
      name,             // E
      phone,            // F
      leader,           // G
      special,          // H
      ...attendance,    // I~T
      fee               // U (등록비)
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
