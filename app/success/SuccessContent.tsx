// app/success/SuccessContent.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";


const accountMap: Record<string, string> = {
  "2부 두나미스": "카카오뱅크 3333-35-7454312 (예금주: 이주선)",
  "5부 필그림": "카카오뱅크 3333-22-46216669 (예금주: 신예현)",
  "6부 예닮공": "카카오뱅크 3333-34-1076815 (예금주: 이태희)",
};

export default function SuccessContent() {
  const params = useSearchParams()!;

  const department = params.get("department") || "";
  const fee = params.get("fee") || "0";

  const accountText = department
    ? accountMap[department] ?? "계좌 정보가 없습니다."
    : "부서를 선택해주세요.";

  return (
    <div className="min-h-screen py-8 px-4 flex justify-center bg-black">
      <div className="w-full max-w-[800px]">
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <h1 className="text-xl font-semibold mb-4">등록폼 제출이 완료되었습니다!</h1>

          <p className="mb-4">
            입금까지 완료하셔야 등록이 완료되니, 아래 내용 확인하셔서 입금 부탁드립니다.
          </p>

          <p className="mb-4">-</p>

          <div className="mb-1 text-center">
            <div className="text-lg font-semibold">
              💸 {department} 입금 계좌:
            </div>

            <div className="mt-1 font-medium text-black-700 flex items-center justify-center gap-2">
              {accountText}
              <button
                onClick={() => navigator.clipboard.writeText(accountText)}
                className="text-gray-600 hover:text-black"
                aria-label="계좌번호 복사"
              >
                <ClipboardDocumentIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="text-1 font-medium text-black-600">
            입금 금액 : {Number(fee).toLocaleString()}원
          </div>
        </div>
      </div>
    </div>
  );
}
