'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import {
  SunIcon,
  MoonIcon,
  HomeIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";


const accountMap: Record<string, string> = {
  "2부 두나미스": "카카오뱅크 3333-35-7454312 (예금주: 이주선)",
  "5부 필그림": "카카오뱅크 3333-22-46216669 (예금주: 신예현)",
  "6부 예닮공": "카카오뱅크 3333-34-1076815 (예금주: 이태희)",
};

export default function Page() {
  const router = useRouter();

  // --- form states (1~8) ---
  const [agree, setAgree] = useState(false);
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [gender, setGender] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [leader, setLeader] = useState('');
  const [special, setSpecial] = useState(''); // 7번만 필수 아님
  const agreeRef = React.useRef<HTMLDivElement>(null);

  const [paid, setPaid] = useState(false);
  const accountText = department ? accountMap[department] : "부서를 선택하면 계좌가 표시됩니다.";

  // --- attendance (9) ---
  const dayKeys = ['wed', 'thu', 'fri', 'sat'];
  const dayLabels = ['1/21(수)', '1/22(목)', '1/23(금)', '1/24(토)'];
  const rowKeys = [
    { key: 'morning', label: '아침', icon: SunIcon },
    { key: 'lunch', label: '점심', icon: Bars3Icon },
    { key: 'dinner', label: '저녁', icon: MoonIcon },
    { key: 'night', label: '숙박', icon: HomeIcon },
  ];

  const disabledMap: Record<string, boolean> = {
    'wed-morning': true,
    'sat-dinner': true,
    'sat-night': true,
  };
  const [selectedCells, setSelectedCells] = useState<Record<string, boolean>>({});

  const FULL_FEE = 60000;
  const PER_ITEM = 12000;
  const [fee, setFee] = useState<number>(0);

  const toggleCell = (dayKey: string, rowKey: string) => {
    const k = `${dayKey}-${rowKey}`;
    if (disabledMap[k]) return;
    setSelectedCells(prev => ({ ...prev, [k]: !prev[k] }));
  };

  const selectAll = () => {
    const next: Record<string, boolean> = {};
    dayKeys.forEach(d => rowKeys.forEach(r => {
      const k = `${d}-${r.key}`;
      if (!disabledMap[k]) next[k] = true;
    }));
    setSelectedCells(next);
  };

  const clearAll = () => setSelectedCells({});

  // --- fee 계산 ---
  useEffect(() => {
    let checkedCount = 0;
    const dinnerOrNightDays = new Set<string>();

    dayKeys.forEach(d => {
      let hasDinnerOrNight = false;
      rowKeys.forEach(r => {
        const key = `${d}-${r.key}`;
        if (selectedCells[key]) {
          if (r.key === 'dinner' || r.key === 'night') hasDinnerOrNight = true;
          else checkedCount += 1;
        }
      });
      if (hasDinnerOrNight) dinnerOrNightDays.add(d);
    });

    checkedCount += dinnerOrNightDays.size;
    let total = checkedCount * PER_ITEM;
    if (total > FULL_FEE) total = FULL_FEE;
    setFee(total);
  }, [selectedCells]);

  const phoneLooksValid = (p: string) => /\d{2,3}-\d{3,4}-\d{4}$/.test(p);

  const handleSubmit = async () => {

    // --- 🔒 필수 항목 검증 ---
    if (!agree) { alert('개인정보 수집 동의가 필요합니다.'); return; }
    if (!department) { alert('소속 부서를 선택해주세요.'); return; }
    if (!year) { alert('학년을 선택해주세요.'); return; }
    if (!gender) { alert('성별을 선택해주세요.'); return; }
    if (!name) { alert('이름을 입력해주세요.'); return; }
    if (!phone || !phoneLooksValid(phone)) {
      alert('연락처 형식을 확인해주세요. (예: 010-1234-5678)');
      return;
    }
    if (!leader) { alert('GBS 리더 이름을 입력해주세요.'); return; }

    // 7번(special)은 필수 X 이므로 검증 없음

    // 출석 최소 1개 필수
    const selectedCount = Object.values(selectedCells).filter(v => v).length;
    if (selectedCount === 0) {
      alert('참석 일정을 최소 1개 이상 선택해주세요.');
      return;
    }

    if (!paid) {
      alert("입금을 완료해야 제출할 수 있습니다.");
      return;
    }

    // 체크박스 값 매핑 (1이면 표시)
    const attendanceMap: Record<string, string> = {};
    dayKeys.forEach(d => rowKeys.forEach(r => {
      const key = `${d}-${r.key}`;
      attendanceMap[key] = selectedCells[key] ? '1' : '';
    }));

    // H~U 열: 수점~토점
    const columns9 = [
      'wed-lunch', 'wed-dinner', 'wed-night',
      'thu-morning', 'thu-lunch', 'thu-dinner', 'thu-night',
      'fri-morning', 'fri-lunch', 'fri-dinner', 'fri-night',
      'sat-morning', 'sat-lunch',
    ];
    const values9 = columns9.map(c => attendanceMap[c] || '');

    const payload = {
      department, year, gender, name, phone, leader, special,
      attendance: values9, fee, paid
    };

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        router.push(`/success?department=${encodeURIComponent(department)}&fee=${fee}`);
      } else {
        alert('제출 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('제출 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 flex justify-center bg-black font-pretendard text-white">
      <div className="w-full max-w-[800px]">

        {/* 타이틀 박스 */}
        <div className="bg-white text-black rounded-2xl shadow p-5 text-center mb-6">
          <h1 className="text-xl font-semibold">2026 사랑의교회 대학부 256 겨울연합수양회</h1>

          <p className="text-3xl mt-2 font-bold">
            CHURCHNESS : 교회다움{" "}
            <span className="text-gray-500 font-semibold">참여신청서</span>
          </p>
        </div>

        {/* 안내문 */}
        <div className="w-full bg-gray-50 text-black rounded-xl p-5 mb-6 text-sm leading-relaxed border border-gray-200">

          <p className="font-semibold text-center mb-3">
            “또 만물을 그의 발 아래에 복종하게 하시고 그를 만물 위에 교회의 머리로 삼으셨느니라 교회는 그의 몸이니 만물 안에서 만물을 충만하게 하시는 이의 충만함이니라" [에베소서 1:22-23]
          </p>

          <p className="text-sm mb-1">🗓️ 주후 2026년 1월 21일(수) - 1월 24일(토)</p>
          <p className="text-sm mb-1">📍 사랑의교회 안성수양관</p>
          <p className="text-sm mb-3">🎤 임병선 목사 (용인제일교회)</p>

          <p className="text-sm mb-1"><span className="bg-yellow-100">✅ <b>1차 등록</b>: 주후 2025년 12월 7일(주일) - 2026년 1월 3일(토) → 전참 60,000원</span></p>

          <p className="text-sm mb-1">✅ <b>2차 등록</b>: 주후 2026년 1월 4일(주일) - 2026년 1월 18일(주일) → 전참 65,000원</p>
          <p className="text-sm mb-3">✅ <b>3차 현장 등록</b>: 주후 2026년 1월 24일(수) → 전참 70,000원</p>

          <p className="text-sm mb-1">** 저녁식사와 숙박의 경우, ① 둘 중 하나만 선택하거나 ② 둘 모두를 선택하는 경우 모두 동일하게 12,000원으로 책정됩니다.</p>
          <p className="text-sm mb-3">** 등록비는 입금 날짜 기준으로 책정됩니다. 신청서 제출 후, 반드시 입금을 바로 해주시기 바랍니다 :)</p>

          <p className="text-sm">📞 문의 : 각 부서 행정간사</p>
        </div>

        {/* 설문 박스 */}
        <div className="bg-white text-black rounded-2xl shadow p-6 relative">

          {/* 1. 개인정보 수집 동의 */}
          <div className="mb-8 flex justify-center" ref={agreeRef}>
            <label className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-4 rounded-2xl shadow-sm cursor-pointer text-center">
              
              <span className="font-semibold text-gray-800 whitespace-nowrap">
                개인정보 수집 및 이용에 동의합니다.
              </span>

              <input
                type="checkbox"
                checked={agree}
                onChange={e => setAgree(e.target.checked)}
                className="h-5 w-5 cursor-pointer"
              />
            </label>
          </div>

          {/* --- 나머지 UI는 동일 --- */}

          {/* 2. 소속 부서 */}
          <div className="mb-10">
            <label className="font-medium block mb-1">1️⃣ 소속 부서를 선택해주세요.</label>
            <select className="w-full border rounded p-2" value={department} onChange={e => setDepartment(e.target.value)}>
              <option value="">선택해주세요</option>
              <option value="2부 두나미스">2부 두나미스</option>
              <option value="5부 필그림">5부 필그림</option>
              <option value="6부 예닮공">6부 예닮공</option>
            </select>
          </div>

          {/* 3. 학년 */}
          <div className="mb-10">
            <label className="font-medium block mb-1">2️⃣ 학년을 선택해주세요. (2026년 기준)</label>
            <select className="w-full border rounded p-2" value={year} onChange={e => setYear(e.target.value)}>
              <option value="">선택해주세요</option>
              {Array.from({ length: 16 }, (_, i) => i + 1).map(n => (
                <option key={n} value={String(n)}>{n}학년</option>
              ))}
            </select>
          </div>

          {/* 4. 성별 */}
          <div className="mb-10">
            <label className="font-medium block mb-1">3️⃣ 성별을 선택해주세요.</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input type="radio" name="gender" checked={gender==='남자'} onChange={()=>setGender('남자')} /> 남
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="gender" checked={gender==='여자'} onChange={()=>setGender('여자')} /> 여
              </label>
            </div>
          </div>

          {/* 5. 이름 */}
          <div className="mb-10">
            <label className="font-medium block mb-1">4️⃣ 이름을 입력해주세요.</label>
            <input className="w-full border rounded p-2" value={name} onChange={e=>setName(e.target.value)} />
          </div>

          {/* 6. 연락처 */}
          <div className="mb-10">
            <label className="font-medium block mb-1">5️⃣ 연락처를 아래와 같은 양식으로 입력해주세요.</label>
            <p className="text-sm text-gray-500 mb-2">
              작성 양식 : 010-1234-5678
            </p>
            <input className="w-full border rounded p-2" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="010-1234-5678"/>
          </div>

          {/* 7. GBS 리더 */}
          <div className="mb-10">
            <label className="font-medium block mb-1">6️⃣ 현재 부서 GBS 리더 이름을 입력해주세요.</label>
            <input className="w-full border rounded p-2" value={leader} onChange={e=>setLeader(e.target.value)} />
          </div>

          {/* 8. 새돌/새가족/현역 — 필수 아님 */}
          <div className="mb-10">
            <label className="font-medium block mb-1">
              7️⃣ 2026 새돌, 새가족, 현역군지체 중 해당사항이 있는 경우 선택해주세요.
            </label>

            <p className="text-sm text-gray-500 mb-2">
              ** 새가족 기준 : 2025-2 텀에 등반하였거나, 아직 등반을 하지 않은 새가족
            </p>

            <select
              className="w-full border rounded p-2"
              value={special}
              onChange={e => setSpecial(e.target.value)}
            >
              <option value="">선택 안 함</option>
              <option value="2026 새돌">2026 새돌</option>
              <option value="새가족">새가족</option>
              <option value="현역 군지체">현역 군지체</option>
            </select>
          </div>

          {/* 9. 출석 체크 */}
          <div className="mb-10">

            <div className="font-medium mb-1 text-left">
              8️⃣ 참석 일정을 선택해주세요.
            </div>
            <p className="text-sm text-red-500 mb-3">
              등록비가 동일하더라도, 반드시 실제로 참석하시는 일정을 체크해주시기 바랍니다!
            </p>

            <div className="flex justify-center gap-3 mb-4">
              <button
                type="button"
                onClick={selectAll}
                className="px-4 py-1.5 rounded bg-gray-200 hover:bg-gray-300"
              >
                전체 선택
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="px-4 py-1.5 rounded bg-gray-200 hover:bg-gray-300"
              >
                전체 해제
              </button>
            </div>

            <div className="overflow-x-auto relative">
              <table className="w-full border-collapse text-center">
                <thead>
                  <tr>
                    <th className="border p-2 bg-gray-100 w-24"></th>
                    {dayLabels.map(dl => (
                      <th key={dl} className="border p-2 bg-gray-100">{dl}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {rowKeys.map(r => (
                    <tr key={r.key}>
                      <td className="border p-2 bg-gray-50 font-semibold">
                        <div className="flex items-center justify-center gap-1">
                          <r.icon className="w-5 h-5 text-gray-700" />
                          {r.label}
                        </div>
                      </td>

                      {dayKeys.map(dk => {
                        const k = `${dk}-${r.key}`;
                        const disabled = !!disabledMap[k];

                        return (
                          <td key={k} className="border p-2">
                            <input
                              type="checkbox"
                              checked={!!selectedCells[k]}
                              disabled={disabled}
                              onChange={() => toggleCell(dk, r.key)}
                              className={`h-5 w-5 ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-right mt-2 pr-2 text-sm font-medium text-blue-700">
                등록비: {fee.toLocaleString()}원
              </div>
            </div>
          </div>

          {/* 10. 확인 (계좌 및 동의) */}
          <div className="mb-7 bg-[#fff3cd] border border-[#ffeeba] rounded p-4 text-base leading-relaxed">

            <div className="font-black mb-2">💸 입금 안내 :</div>

            <div className="mt-2">

              <span className="font-medium">
                ** {department || "부서 선택 전"} 입금 계좌 :
              </span>

              <div className="mt-2 pl-1 flex items-center gap-2 font-medium text-gray-800">
                {accountText}
                <button
                  onClick={() => navigator.clipboard.writeText(accountText)}
                  className="text-gray-600 hover:text-black"
                  aria-label="계좌번호 복사"
                >
                  <ClipboardDocumentIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-2 pl-1 font-medium text-gray-800">
                입금 금액: {fee.toLocaleString()}원
              </div>

              <div className="mt-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={paid}
                    onChange={e => setPaid(e.target.checked)}
                  />
                  <span className="font-semibold text-black-700">입금 완료했습니다!</span>
                </label>
              </div>

            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              className="w-full bg-[#fdf1b5] py-3 rounded text-base font-medium transition-transform transform hover:-translate-y-0.5 active:scale-95 hover:brightness-95 cursor-pointer"
            >
              제출하기
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
