'use client';

import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen px-4 py-10 flex justify-center bg-gradient-to-b from-neutral-100 to-neutral-200 font-pretendard text-black text-sm sm:text-base">
      <div className="w-full max-w-[800px]">

        {/* ------------------------ 로고 ------------------------ */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="겨울연합수양회 로고"
            width={120}
            height={120}
            className="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] object-contain"
          />
        </div>

        {/* ------------------------ 안내 카드 ------------------------ */}
        <div className="bg-white backdrop-blur-xl border border-white/40 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-10 text-center">

<p className="text-sm font-semibold mb-2 whitespace-nowrap">
  지금은 응답 기간이 아닙니다.
</p>

<p className="text-xs text-gray-600 whitespace-nowrap">
  2026년 1월 4일(주일) 자정부터 2차 등록이 진행됩니다.
</p>
        </div>
      </div>
    </div>
  );
}
