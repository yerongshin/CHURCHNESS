"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params?.get("session_id") ?? "";

  return (
    <div>
      <h1>결제가 성공적으로 완료되었습니다!</h1>
      <p>세션 ID: {sessionId}</p>
    </div>
  );
}
