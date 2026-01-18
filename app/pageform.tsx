
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

import {
  ClipboardDocumentIcon,
  SunIcon,
  MoonIcon,
  HomeIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";


const yearNameMap: Record<string, { year: number; label: string }[]> = {
  /* -------------------- 2부 -------------------- */
  "2부 두나미스": [
    { year: 1, label: "2026 새돌" },
    { year: 2, label: "이로" },
    { year: 3, label: "설" },
    { year: 4, label: "하온" },
    { year: 5, label: "릴리" },
    { year: 6, label: "히엘" },
    { year: 7, label: "브레" },
    { year: 8, label: "그랑" },
    { year: 9, label: "예랑" },
    { year: 10, label: "이레" },
    { year: 11, label: "하울" },
    { year: 12, label: "도담" },
    { year: 13, label: "예나함" },
  ],

  /* -------------------- 5부 -------------------- */
  "5부 필그림": [
    { year: 1, label: "새돌" },
    { year: 2, label: "아스테르" },
    { year: 3, label: "유노이아" },
    { year: 4, label: "아르니온" },
    { year: 5, label: "피스티스" },
    { year: 6, label: "클레마" },
    { year: 7, label: "엘라이아" },
    { year: 8, label: "엘레오스" },
    { year: 9, label: "에워디아" },
    { year: 10, label: "아파르케" },
    { year: 11, label: "클레시스" },
    { year: 12, label: "에이레네" },
    { year: 13, label: "카르디아" },
    { year: 14, label: "아가파오" },
    { year: 15, label: "호밀레오" },
  ],

  /* -------------------- 6부 -------------------- */
  "6부 예닮공": [
    { year: 1, label: "2026 새돌" },
    { year: 2, label: "예디드" },
    { year: 3, label: "헤세드" },
    { year: 4, label: "아스테리" },
    { year: 5, label: "마하나임" },
    { year: 6, label: "히엘" },
    { year: 7, label: "루하마" },
    { year: 8, label: "포네" },
    { year: 9, label: "유노이아" },
    { year: 10, label: "에이레네" },
    { year: 11, label: "프로이아" },
    { year: 12, label: "나디야" },
    { year: 13, label: "포이에마" },
  ],
};




const accountMap: Record<string, string> = {
  "2부 두나미스": "카카오뱅크 3333-35-7454312 (예금주: 이주선)",
  "5부 필그림": "카카오뱅크 3333-22-4621669 (예금주: 신예현)",
  "6부 예닮공": "카카오뱅크 3333-34-1076815 (예금주: 이태희)",
};

export default function Page() {
  const router = useRouter();

  // --- form states ---
  const [agree, setAgree] = useState(false);
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [gender, setGender] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [leader, setLeader] = useState('');
  const [special, setSpecial] = useState(''); // optional
  const [paid, setPaid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
const isOpen = false; // 🔒 응답 기간 여부


  const agreeRef = React.useRef<HTMLDivElement>(null);

  const accountText = department
    ? accountMap[department]
    : "부서를 선택하면 계좌가 표시됩니다.";

  // attendance
  const [attendType, setAttendType] = useState<"none" | "full" | "partial">("none");

  const dayKeys = ["wed", "thu", "fri", "sat"];
  const dayLabels = ["1/21(수)", "1/22(목)", "1/23(금)", "1/24(토)"];

  const rowKeys = [
    { key: "morning", label: "아침", icon: SunIcon },
    { key: "lunch", label: "점심", icon: Bars3Icon },
    { key: "dinner", label: "저녁", icon: MoonIcon },
    { key: "night", label: "숙박", icon: HomeIcon },
  ];

  const disabledMap: Record<string, boolean> = {
    "wed-morning": true,
    "sat-dinner": true,
    "sat-night": true,
  };

  const [selectedCells, setSelectedCells] = useState<Record<string, boolean>>({});

  const FIRST_FULL_FEE = 60000; // 1차 등록 전참
  const SECOND_FULL_FEE = 65000; // 2차 등록 전참
  const PER_ITEM = 12000;
  const [fee, setFee] = useState<number>(0);

  const isFirstPriceTarget =
  special === "2026 새돌" ||
  special === "새가족" ||
  special === "현역 군지체";


  const toggleCell = (dayKey: string, rowKey: string) => {
    const k = `${dayKey}-${rowKey}`;
    if (disabledMap[k]) return;
    setSelectedCells((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const selectAll = () => {
    const next: Record<string, boolean> = {};
    dayKeys.forEach((d) =>
      rowKeys.forEach((r) => {
        const k = `${d}-${r.key}`;
        if (!disabledMap[k]) next[k] = true;
      })
    );
    setSelectedCells(next);
  };

  const clearAll = () => setSelectedCells({});
useEffect(() => {
  setYear("");
}, [department]);

  // --- fee 계산 ---
useEffect(() => {
  let checkedCount = 0;
  const dinnerOrNightDays = new Set<string>();

  dayKeys.forEach((d) => {
    let hasDinnerOrNight = false;

    rowKeys.forEach((r) => {
      const key = `${d}-${r.key}`;
      if (selectedCells[key]) {
        if (r.key === "dinner" || r.key === "night") {
          hasDinnerOrNight = true;
        } else {
          checkedCount += 1;
        }
      }
    });

    if (hasDinnerOrNight) dinnerOrNightDays.add(d);
  });

  checkedCount += dinnerOrNightDays.size;

  let total = checkedCount * PER_ITEM;

  // ✅ 여기서 전참 상한 금액 결정
  const fullFee = isFirstPriceTarget
    ? FIRST_FULL_FEE
    : SECOND_FULL_FEE;

  if (total > fullFee) total = fullFee;

  setFee(total);
}, [selectedCells, special]);

  // --- 여기까지 수정 ---

  const phoneLooksValid = (p: string) => /\d{2,3}-\d{3,4}-\d{4}$/.test(p);

  const handleSubmit = async () => {
    // required fields
    if (isSubmitting) return;
    if (!agree) return alert("개인정보 수집 동의가 필요합니다.");
    if (!department) return alert("소속 부서를 선택해주세요.");
    if (!year) return alert("학년을 선택해주세요.");
    if (!gender) return alert("성별을 선택해주세요.");
    if (!name) return alert("이름을 입력해주세요.");
    if (!phone || !phoneLooksValid(phone))
      return alert("연락처 형식을 확인해주세요. (예: 010-1234-5678)");
    if (!leader) return alert("GBS 리더 이름을 입력해주세요.");

    const selectedCount = Object.values(selectedCells).filter(Boolean).length;
    if (selectedCount === 0)
      return alert("참석 일정을 최소 1개 이상 선택해주세요.");

    if (!paid) return alert("입금을 완료해야 제출할 수 있습니다.");

    // attendance mapping
    const attendanceMap: Record<string, string> = {};
    dayKeys.forEach((d) =>
      rowKeys.forEach((r) => {
        const key = `${d}-${r.key}`;
        attendanceMap[key] = selectedCells[key] ? "1" : "";
      })
    );

    const columns9 = [
      "wed-lunch",
      "wed-dinner",
      "wed-night",
      "thu-morning",
      "thu-lunch",
      "thu-dinner",
      "thu-night",
      "fri-morning",
      "fri-lunch",
      "fri-dinner",
      "fri-night",
      "sat-morning",
      "sat-lunch",
    ];

    const values9 = columns9.map((c) => attendanceMap[c] || "");

    const payload = {
      department,
      year,
      gender,
      name,
      phone,
      leader,
      special,
      attendance: values9,
      fee,
      paid,
    };

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.ok) {
        router.push(`/success?department=${encodeURIComponent(department)}&fee=${fee}`);
      } else {
        alert("제출 중 오류가 발생했습니다.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      alert("제출 중 오류가 발생했습니다.");
      setIsSubmitting(false);
    }
  };

  // shared input/select classes
const inputBase =
  "w-full h-12 rounded-xl border border-gray-200 bg-white/60 backdrop-blur-md px-4 text-[15px] text-gray-900 shadow-sm transition focus:outline-none focus:border-gray-400 focus:bg-white/80";

const buttonBase =
  "inline-flex items-center justify-center h-11 px-5 rounded-full text-sm font-medium transition active:scale-[0.98]";

const buttonPrimary =
  "bg-black text-white hover:bg-gray-800";

const buttonSecondary =
  "bg-white/70 text-gray-900 border border-gray-200 hover:bg-white";


  return (

    
  <div className="min-h-screen px-4 py-10 flex justify-center bg-gradient-to-b from-neutral-100 to-neutral-200 font-pretendard text-black text-sm sm:text-base">

      <div className="w-full max-w-[800px]">
 {/* ------------------------ 로고 ------------------------ */}
<div className="flex justify-center mb-4">
  <Image
    src="/logo.png"
    alt="겨울연합수양회 로고"
    width={120}
    height={120}
    className="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] object-contain"
  />
</div>
  <div className="text-center mb-6">

    <div className="font-medium">
            <div className="flex flex-col items-center gap-1">
        <div className="text-s">2026 사랑의교회 대학부 2•5•6 겨울연합수양회</div>
      </div>
    </div>
    <div className="font-bold">
      <div className="flex flex-col items-center gap-1">
        <div className="text-xl">"CHURCHNESS : 교회다움"</div>
      </div>
            <div className="flex flex-col items-center gap-1">
        <div className="text-xl">참가신청서 </div>
      </div>

      

    </div>
  </div>

{/* ------------------------ 안내문 ------------------------ */}
<div className="bg-white backdrop-blur-xl border border-white/40 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6 mb-6">

  {/* 타이틀 */}

  {/* 성경 구절 */}        
          <p className="mb-0 text-center italic font-medium text-gray-600 leading-relaxed">
            또 만물을 그의 발 아래에 복종하게 하시고 그를 만물 위에 교회의
            머리로 삼으셨느니라 교회는 그의 몸이니 만물 안에서 만물을 충만하게
            하시는 이의 충만함이니라
          </p>         
                  <p className="mb-6 text-center italic font-medium text-gray-600 leading-relaxed">
           (에베소서 1:22-23)
          </p>  

          <p className="text-sm mb-1">🗓️ 주후 2026년 1월 21일(수) - 1월 24일(토)</p>
          <p className="text-sm mb-1">📍 사랑의교회 안성수양관</p>
          <p className="text-sm mb-6">🎤 임병선 목사 (용인제일교회)</p>

            <p className="text-sm mb-1">
            <span className="line-through text-gray-400">
                ✅ 1차 등록 : 주후 2025년 12월 7일(주일) - 2026년 1월 3일(토) → 전참 60,000원
            </span>
            </p>

            <p className="text-sm mb-1">
            <span className="bg-yellow-100">
                ✅ <b>2차 등록</b> : 주후 2026년 1월 4일(주일) - 1월 18일(주일) → 전참 65,000원
            </span>
            </p>

            <p className="text-sm mb-6">
            ✅ 현장 등록 : 주후 2026년 1월 21일(수) → 전참 70,000원
            </p>
            
          <p className="text-sm mb-1">
            ** 저녁식사·숙박 : 둘 중 하나만 선택하거나 둘 다 선택해도 12,000원
          </p>
          <p className="text-sm mb-6">
            ** 등록비는 입금 날짜 기준입니다. 제출 후 바로 입금해주세요 :)
          </p>

          <p className="text-sm">📞 문의 : </p>
          <p className="text-sm">     2부 : 이주선 사역간사 (010-9454-8169) </p>
          <p className="text-sm">     5부 : 신예현 행정간사 (010-4581-1050) </p>
          <p className="text-sm">     6부 : 김지환 행정간사 (010-4977-3103) </p>
        </div>

        {/* ------------------------ 설문 시작 ------------------------ */}
        <div className="bg-white text-black rounded-2xl shadow p-6 relative">

          {/* 1. 개인정보 동의 */}
          <div className="mb-8 flex justify-center" ref={agreeRef}>
            <label className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-4 rounded-2xl shadow-sm cursor-pointer">
              <span className="font-semibold text-gray-800">
                개인정보 수집 및 이용에 동의합니다.
              </span>
              <input
                type="checkbox"
                className="h-6 w-6 cursor-pointer accent-black"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
            </label>
          </div>

          {/* ------------------- 2. 소속 ------------------- */}
          <div className="mb-10">
            <label className="font-medium block mb-3">
              1️⃣ 소속 부서를 선택해주세요.
            </label>

            <select
              className={inputBase}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {/* placeholder */}
              <option value="" disabled hidden>
                선택해주세요
              </option>

              <option value="2부 두나미스">2부 두나미스</option>
              <option value="5부 필그림">5부 필그림</option>
              <option value="6부 예닮공">6부 예닮공</option>
            </select>
          </div>

          {/* ------------------- 3. 학년 ------------------- */}
          <div className="mb-10">
            <label className="font-medium block mb-3">
              2️⃣ 학년을 선택해주세요. (2026년 기준)
            </label>

            <select
              className={inputBase}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              disabled={!department}
            >
              {/* placeholder */}
              <option value="" disabled hidden>
                {department ? "학년을 선택해주세요" : "부서를 먼저 선택해주세요"}
              </option>

              {yearNameMap[department]?.map(({ year, label }) => (
                <option key={year} value={year}>
                  {year}학년 {label}
                </option>
              ))}

              {/* fallback (혹시 맵 없는 경우) */}
              {!yearNameMap[department] &&
                Array.from({ length: 16 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}학년
                  </option>
                ))}
            </select>
          </div>

          {/* ------------------- 4. 성별 ------------------- */}
          <div className="mb-10">
            <label className="font-medium block mb-3">3️⃣ 성별을 선택해주세요.</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  className="h-4 w-4"
                  checked={gender === "남자"}
                  onChange={() => setGender("남자")}
                />
                남
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  className="h-4 w-4"
                  checked={gender === "여자"}
                  onChange={() => setGender("여자")}
                />
                여
              </label>
            </div>
          </div>

          {/* ------------------- 5. 이름 ------------------- */}
          <div className="mb-10">
            <label className="font-medium block mb-3">4️⃣ 이름을 입력해주세요.</label>
            <input
              className={inputBase}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* ------------------- 6. 연락처 ------------------- */}
          <div className="mb-10">
            <label className="font-medium block mb-1">
              5️⃣ 연락처를 아래와 같은 양식으로 입력해주세요.
            </label>
            <p className="text-sm text-gray-500 mb-2">예시: 010-1234-5678</p>
            <input
              className={inputBase}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-1234-5678"
            />
          </div>

          {/* ------------------- 7. GBS 리더 ------------------- */}
          <div className="mb-10">
            <label className="font-medium block mb-1">
              6️⃣ 현재 부서 GBS 리더 이름을 입력해주세요.
            </label>
            <p className="text-sm text-gray-500 mb-2"> ** 리더, 엘더, 간사님의 경우 본인 이름을 적어주세요! </p>
            <input
              className={inputBase}
              value={leader}
              onChange={(e) => setLeader(e.target.value)}
            />
          </div>

          {/* ------------------- 8. 새가족/현역(선택) ------------------- */}
          <div className="mb-10">
            <label className="font-medium block mb-2">
              7️⃣ 2026 새돌 / 새가족 / 현역군지체 중 해당사항이 있다면 선택해주세요.
            </label>
            <p className="text-sm text-gray-500 mb-1"> ** 새가족 기준 : 2025-2 텀에 등반하였거나, 아직 등반을 하지 않은 새가족 </p>
            <p className="text-sm text-gray-500 mb-1"> ** 현역군지체 기준 : 사회복무요원, 직업군인, 카투사 제외 </p>
            <select
              className={inputBase}
              value={special}
              onChange={(e) => setSpecial(e.target.value)}
            >
              <option value="">해당사항 없음</option>
              <option value="2026 새돌">2026 새돌</option>
              <option value="새가족">새가족</option>
              <option value="현역 군지체">현역 군지체</option>
            </select>
          </div>

 {/* ------------------- 9. 출석 체크 ------------------- */}
<div className="mb-6">
  <div className="font-medium mb-3">8️⃣ 참석 일정을 선택해주세요.</div>

{/* ------------------- 전참 / 부분참 (Apple style) ------------------- */}
<div className="flex mb-3 rounded-xl bg-gray-100 p-1 w-fit">
  {/* 전참 */}
  <button
    type="button"
    onClick={() => {
      setAttendType("full");
      selectAll();
    }}
    className={`px-5 py-2 text-sm font-medium rounded-lg transition-all
      ${
        attendType === "full"
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-500 hover:text-gray-900"
      }`}
  >
    전참
  </button>

  {/* 부분참 */}
  <button
    type="button"
    onClick={() => {
      setAttendType("partial");
      clearAll();
    }}
    className={`px-5 py-2 text-sm font-medium rounded-lg transition-all
      ${
        attendType === "partial"
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-500 hover:text-gray-900"
      }`}
  >
    부분참
  </button>
</div>

  {attendType === "partial" && (
    <div className="mb-3 text-center font-bold text-black-700">
      부분참 일정을 선택해주세요.
    </div>
  )}


{/* 전참 또는 부분참일 때만 표 표시 */}
{(attendType === "full" || attendType === "partial") && (
  <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-md shadow-sm">

    {/* ✅ 부분참 안내 문구 (카드 내부 상단) */}
    {attendType === "partial" && (
      <div className="px-4 py-3 border-b border-gray-100 text-sm">
        <div className="font-semibold text-gray-800 mb-2">
          부분참 참석 안내
        </div>

        <ul className="space-y-1 text-gray-600">
          <li>
            • 등록비와 관계없이 <b>실제 참석 일정</b>을 정확히 선택해주세요.
          </li>
          <li>
            • 대학부 셔틀버스 이용 시, 저녁 이후 도착 예정이므로
            <b> 해당일 ‘숙박’</b>부터 체크해주세요.
          </li>
        </ul>
      </div>
    )}

    {/* ✅ 출석 표 */}
    <table className="w-full text-center text-[11px] sm:text-sm">
      <thead>
        <tr>
          <th className="p-2 bg-gray-50 text-gray-700 font-medium w-16"></th>
          {dayLabels.map((dl) => (
            <th
              key={dl}
              className="p-2 bg-gray-50 text-gray-700 font-medium"
              style={{ width: 60, minWidth: 60 }}
            >
              {dl}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rowKeys.map((r) => (
          <tr key={r.key} className="border-t border-gray-100">
            <td className="p-2 bg-gray-50/70 font-medium text-gray-800">
              <div className="flex items-center justify-center gap-1">
                <r.icon className="w-4 h-4 text-gray-600" />
                <span>{r.label}</span>
              </div>
            </td>

            {dayKeys.map((dk) => {
              const k = `${dk}-${r.key}`;
              const disabled = !!disabledMap[k];

              return (
                <td key={k} className="p-2 hover:bg-gray-50 transition">
                  <input
                    type="checkbox"
                    checked={!!selectedCells[k]}
                    disabled={disabled}
                    onChange={() => toggleCell(dk, r.key)}
                    className={`h-5 w-5 accent-black ${
                      disabled
                        ? "opacity-30 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>

    {/* ✅ 등록비 요약 바 */}
    <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100 bg-gray-50/70">
      <span className="text-sm text-gray-600">
        선택한 일정 기준 등록비
      </span>
      <span className="text-base font-semibold text-gray-900">
        {fee.toLocaleString()}원
      </span>
    </div>
  </div>
)}
  </div>



{/* ------------------- 입금 안내 ------------------- */}
<div   className="
    mb-8
    px-5 py-4
    rounded-2xl
    border border-gray-200
    bg-white/80
    backdrop-blur-sm
    text-sm
    shadow-sm
">
  <div className="flex items-center gap-2 mb-4">
    <span className="text-lg">💸</span>
    <span className="font-semibold text-gray-900">입금 안내</span>
  </div>

  <div className="space-y-3 text-sm text-gray-800">
    <div>
      <span className="font-medium text-gray-600">
        {department || "부서 선택 전"} 입금 계좌
      </span>

      <div className="mt-1 flex items-center gap-2 font-medium">
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

    <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-200">
      <span className="font-medium text-gray-600">입금하실 금액</span>
      <span className="text-lg font-semibold text-gray-900">
        {fee.toLocaleString()}원
      </span>
    </div>

    <div className="pt-3">
      <label className="flex items-center gap-2 cursor-pointer">
        <span className="font-medium text-gray-800">
          입금을 완료했습니다
        </span>
        <input
      type="checkbox"
      checked={paid}
      onChange={(e) => setPaid(e.target.checked)}
      className="
        h-5 w-5
        rounded
        border-gray-300
        accent-gray-900
        cursor-pointer
      "
    />
      </label>
    </div>
  </div>
</div>

{/* ------------------- 제출 버튼 ------------------- */}
<div className="mt-6">
  <button
    onClick={handleSubmit}
    disabled={isSubmitting}
    className={`w-full h-12 rounded-xl text-base font-medium transition-all
      ${isSubmitting
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-black text-white hover:bg-gray-900 active:scale-[0.98]"
      }`}
  >
    {isSubmitting ? "제출 중입니다..." : "제출하기"}
  </button>
</div>
        </div>
      </div>
    </div>
  );
}