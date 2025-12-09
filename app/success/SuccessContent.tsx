// app/success/SuccessContent.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { ClipboardDocumentIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

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
  const params = useSearchParams();

  const department = params.get("department") || "";
  const fee = params.get("fee") || "0";

  const accountText =
    department && accountMap[department]
      ? accountMap[department]
      : "계좌 정보가 없습니다.";

  const insuranceUrl = insuranceLinks[department];

  return (
    <div className="
  min-h-screen px-4 py-8 flex justify-center
  bg-gradient-to-b from-gray-50 to-gray-100
  text-gray-900
">
      <div className="w-full max-w-[720px] space-y-6">

        {/* ✅ 완료 카드 */}
        <div className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-md shadow-sm p-6 text-center text-black">
          <CheckCircleIcon className="w-14 h-14 mx-auto text-green-600 mb-3" />

          <h1 className="text-xl font-semibold mb-2">
            참가신청서 제출이 완료되었습니다
          </h1>

          <p className="text-sm text-gray-600">
            입금까지 완료하셔야 등록이 완료되니, 아래 내용 확인하셔서 입금 부탁드립니다.
          </p>
        </div>

        {/* ✅ 입금 안내 카드 */}
        <div className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-md shadow-sm p-5 text-black">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">💸</span>
            <span className="font-semibold">입금 안내</span>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <div className="text-gray-600 font-medium mb-1">
                {department} 입금 계좌
              </div>

              <div className="flex items-center gap-2 font-medium">
                <span>{accountText}</span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(accountText)}
                  className="text-gray-500 hover:text-gray-900 transition"
                  aria-label="계좌 복사"
                >
                  <ClipboardDocumentIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-gray-600 font-medium">입금하실 금액</span>
              <span className="text-lg font-semibold">
                {Number(fee).toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* ✅ 여행자 보험 카드 */}
        <div className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-md shadow-sm p-6 text-black">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📌</span>
            <span className="font-semibold">여행자 보험 가입 안내</span>
          </div>

          <p className="text-sm leading-relaxed text-gray-700 mb-4">
            수양회 기간 동안 여러분의 안전을 위해{" "}
            <span className="font-semibold text-black">
              여행자 보험 가입은 필수
            </span>
            입니다.
            <br />
            보험 미가입 시 수양회 중 발생하는 모든 사고에 대한 책임은{" "}
            <span className="font-semibold">본인에게 있음</span>을 안내드립니다.
            <br />
            <br />
            보험 가입비는 <b>등록비에 포함</b>되어 있으니, 아래 링크를 통해 반드시
            보험 가입을 완료해주세요. 안전하고 행복한 수양회가 되기를 기도합니다!
          </p>

          {insuranceUrl ? (
            <a
              href={insuranceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-12 rounded-xl bg-black text-white text-center leading-[3rem]
                         font-medium transition-all hover:bg-gray-900 active:scale-[0.98]"
            >
              {department} 여행자 보험 가입하기
            </a>
          ) : (
            <p className="text-sm text-gray-500">
              부서 정보가 없어 보험 링크를 불러올 수 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
