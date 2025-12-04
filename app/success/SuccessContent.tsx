// app/success/SuccessContent.tsx
"use client";

import { useSearchParams } from "next/navigation";

const accountMap: Record<string, string> = {
  "2부 두나미스": "계좌번호 미정",
  "5부 필그림": "계좌번호 미정",
  "6부 예닮공": "계좌번호 미정",
};

export default function SuccessContent() {
  const params = useSearchParams()!;

  const department = params.get("department") || "";
  const fee = params.get("fee") || "0";

  const accountText = department
    ? accountMap[department] ?? "계좌 정보가 없습니다."
    : "부서를 선택해주세요.";

  return (
    <div className="min-h-screen py-8 px-4 flex justify-center bg-[#a7dbe0]">
      <div className="w-full max-w-[800px]">
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <h1 className="text-xl font-semibold mb-4">등록폼 제출이 완료되었습니다!</h1>

          <p className="mb-4">
            입금까지 완료하셔야 등록이 완료되니, 아래 내용 확인하셔서 입금 부탁드립니다.
          </p>

          <div className="mb-3 text-lg font-medium">
            💳 {department} 부의 등록비 입금 계좌:
            <div className="mt-1 font-bold text-red-700">{accountText}</div>
          </div>

          <div className="text-lg font-medium text-blue-600">
            등록비: {Number(fee).toLocaleString()}원
          </div>
        </div>
      </div>
    </div>
  );
}
