'use client';

export const dynamic = 'force-dynamic'; // 클라이언트 렌더링 강제
import { useSearchParams } from 'next/navigation';

export default function CompletePage() {
  const searchParams = useSearchParams();
  const fee = searchParams.get('fee');
  const department = searchParams.get('department');

  const accountMap: Record<string, string> = {
    "2부 두나미스": "계좌번호 미정",
    "5부 필그림": "계좌번호 미정",
    "6부 예닮공": "계좌번호 미정",
  };
  const accountText = department ? accountMap[department] : "";

  return (
    <div className="min-h-screen py-8 px-4 flex justify-center bg-[#a7dbe0]">
      <div className="w-full max-w-800 bg-white rounded-2xl shadow p-6 text-center">
        <h1 className="text-xl font-semibold mb-4">등록폼 제출 완료</h1>
        <p className="mb-4">
          등록폼 제출이 완료되었습니다! <br/>
          입금까지 완료하셔야 등록이 완료되니, 아래 내용 확인 후 입금 부탁드립니다.
        </p>
        <div className="mb-2 font-semibold">등록비: {fee?.toLocaleString()}원</div>
        <div className="mb-2 font-semibold">부서 계좌: {accountText}</div>
      </div>
    </div>
  );
}
