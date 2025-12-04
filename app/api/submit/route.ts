import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { department, year, gender, name, phone, leader, special, attendance, fee, paid } = body;

    // 환경변수에서 서비스 계정 키를 읽어 파싱
    const rawKey = process.env.GOOGLE_SERVICE_KEY;
    if (!rawKey) {
      console.error("Missing GOOGLE_SERVICE_KEY environment variable");
      return NextResponse.json({ error: "서버 설정 오류: GOOGLE_SERVICE_KEY가 없습니다." }, { status: 500 });
    }

    // env에 넣을 때 JSON을 문자열로 넣었을 가능성이 있으므로 파싱
    let keyFile: any;
    try {
      keyFile = JSON.parse(rawKey);
    } catch (err) {
      // 이미 object로 들어온 경우를 대비 (일반적이지 않음)
      keyFile = rawKey as unknown as object;
    }

    // private_key 내부의 이스케이프된 newline(\\n)을 실제 newline으로 바꿔줌
    if (keyFile && typeof keyFile.private_key === "string") {
      keyFile.private_key = keyFile.private_key.replace(/\\n/g, "\n");
    }

    const auth = new google.auth.GoogleAuth({
      credentials: keyFile,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // 스프레드시트 ID는 환경변수로 관리하길 권장합니다.
    const spreadsheetId = process.env.SPREADSHEET_ID || "1Rv6W6_UsT_mYg5sygtNkr7jakyIhJWH4dKgnnMldtpo";

    const timestamp = new Date().toISOString();

    // A~U 열 배열: 타임스탬프, 부서 등 + attendance 배열 + fee
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
    return NextResponse.json({ error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
