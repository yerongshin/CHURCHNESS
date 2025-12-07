// app/success/SuccessContent.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";

const accountMap: Record<string, string> = {
  "2부 두나미스": "카카오뱅크 3333-35-7454312 (예금주: 이주선)",
  "5부 필그림": "카카오뱅크 3333-22-4621669 (예금주: 신예현)",
  "6부 예닮공": "카카오뱅크 3333-34-1076815 (예금주: 이태희)",
};

const insuranceLinks: Record<string, string> = {
  "2부 두나미스":
    "https://talk.kakaoinsure.com/bridge/talk/public-add-list?productCode=FAA008&id=6d722feb-e941-481e-8d60-8d87e275e298",
  "5부 필그림":
    "https://talk.kakaoinsure.com/bridge/talk/public-add-list?productCode=FAA008&id=2716acf2-ab76-4c19-9fce-fcf05cc46e54",
  "6부 예닮공":
    "https://talk.kakaoinsure.com/bridge/talk/public-add-list?productCode=FAA008&id=28572629-4955-44d2-99e7-2c89c50e5300",
};

export default function SuccessContent() {
  const params = useSearchParams()!;

  const department = params.get("department") || "";
  const fee = params.get("fee") || "0";

  const accountText = department
    ? accountMap[department] ?? "계좌 정보가 없습니다."
    : "부서를 선택해주세요.";

  const insuranceUrl = insuranceLinks[department];

  return (
    <div className="min-h-screen py-8 px-4 flex justify-center bg-black">
      <div className="w-full max-w-[800px]">
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <h1 className="text-xl font-semibold mb-4">
            수양회 참가신청서 제출이 완료되었습니다!
          </h1>

          <p className="mb-4">
            입금까지 완료하셔야 등록이 완료되니, 아래 내용 확인하셔서 입금 부탁드립니다.
          </p>

          <p className="mb-4">-</p>

          {/* 계좌정보 */}
          <div className="mb-1 text-center">
            <div className="text-lg font-semibold">💸 {department} 입금 계좌:</div>

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

          {/* 입금 금액 */}
          <div className="text-lg font-medium text-black-600 mb-6">
            입금하실 금액 : {Number(fee).toLocaleString()}원
          </div>

          {/* 보험 안내 + 부서별 링크 */}
          <div className="mt-6 p-4 border rounded-xl bg-orange-100">
            <div className="text-lg font-semibold mb-2">📌 여행자 보험 가입 안내</div>

            <p className="text-sm leading-relaxed mb-3 text-gray-700">
              수양회 기간 동안 여러분의 안전을 위해{" "}
              <span className="font-semibold text-red-600">
                여행자 보험 가입은 필수입니다.
              </span>
              <br />
              보험 미가입 시 수양회 중 발생하는 모든 사고에 대한 책임은{" "}
              <span className="font-semibold">본인에게 있음을 안내드립니다.</span>
              <br />
              <br />
              <span className="font-semibold">보험 가입비는 등록비에 포함</span>되어
              있으니, 아래 링크를 통해 반드시 보험 가입을 완료해주세요! 안전하고 행복한 수양회가 되기를 기도합니다.
            </p>

            {insuranceUrl ? (
              <a
                href={insuranceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full bg-orange-400 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              >
                👉🏻 {department} 여행자 보험 가입하러 가기
              </a>
            ) : (
              <p className="text-sm text-gray-500">
                부서 선택 정보가 없어 보험 링크를 불러올 수 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
