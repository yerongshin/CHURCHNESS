'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const accountMap: Record<string, string> = {
  "2부 두나미스": "계좌번호 미정",
  "5부 필그림": "계좌번호 미정",
  "6부 예닮공": "계좌번호 미정",
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
  const [special, setSpecial] = useState('');
  const [paid, setPaid] = useState(false);

  const accountText = department ? accountMap[department] : "부서를 선택하면 계좌가 표시됩니다.";

  // --- attendance (9) ---
  const dayKeys = ['wed', 'thu', 'fri', 'sat'];
  const dayLabels = ['수요일', '목요일', '금요일', '토요일'];
  const rowKeys = [
    { key: 'morning', label: '아침' },
    { key: 'lunch', label: '점심' },
    { key: 'dinner', label: '저녁' },
    { key: 'night', label: '숙박' },
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
    if (!agree) { alert('개인정보 수집 동의가 필요합니다.'); return; }
    if (!name) { alert('이름을 입력해주세요.'); return; }
    if (!phone || !phoneLooksValid(phone)) { alert('연락처 형식을 확인해주세요.'); return; }

    const attendanceMap: Record<string, string> = {};
    dayKeys.forEach(d => rowKeys.forEach(r => {
      const key = `${d}-${r.key}`;
      attendanceMap[key] = selectedCells[key] ? '1' : '';
    }));

    const columns9 = [
      'wed-lunch', 'wed-dinner', 'wed-night',
      'thu-morning', 'thu-lunch', 'thu-dinner', 'thu-night',
      'fri-morning', 'fri-lunch', 'fri-dinner', 'fri-night',
      'sat-morning', 'sat-lunch',
    ];
    const values9 = columns9.map(c => attendanceMap[c] || '');

    const payload = { department, year, gender, name, phone, leader, special, attendance: values9, fee, paid };

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
    <div className="min-h-screen py-8 px-4 flex justify-center bg-[#a7dbe0]">
      <div className="w-full max-w-800">
        <div className="bg-white rounded-2xl shadow p-4 text-center mb-6">
          <img src="https://placehold.co/300x80?text=Logo" alt="logo" className="mx-auto mb-2 max-h-20" />
          <h1 className="text-xl font-semibold">2026 사랑의교회 대학부 256 겨울연합수양회 등록</h1>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 relative">
          <h2 className="text-lg font-semibold text-center mb-4">등록 설문지</h2>

          {/* 1~8 문항 */}
          <div className="mb-4">
            <label className="flex items-start gap-2">
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="mt-1" />
              <span>개인정보 수집 및 이용에 동의합니다.</span>
            </label>
          </div>

          {/* 2~8 */}
          <div className="mb-4">
            <label className="font-medium block mb-1">2. 소속 부서</label>
            <select className="w-full border rounded p-2" value={department} onChange={e => setDepartment(e.target.value)}>
              <option value="">선택해주세요</option>
              {Object.keys(accountMap).map(dep => <option key={dep} value={dep}>{dep}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="font-medium block mb-1">3. 학년</label>
            <select className="w-full border rounded p-2" value={year} onChange={e => setYear(e.target.value)}>
              <option value="">선택해주세요</option>
              {Array.from({ length: 16 }, (_, i) => i + 1).map(n => <option key={n} value={String(n)}>{n}학년</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="font-medium block mb-1">4. 성별</label>
            <div className="flex gap-6">
              {['남자','여자'].map(g => (
                <label key={g} className="flex items-center gap-2">
                  <input type="radio" name="gender" checked={gender===g} onChange={()=>setGender(g)} /> {g}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="font-medium block mb-1">5. 이름</label>
            <input className="w-full border rounded p-2" value={name} onChange={e=>setName(e.target.value)} />
          </div>

          <div className="mb-4">
            <label className="font-medium block mb-1">6. 연락처</label>
            <input className="w-full border rounded p-2" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="010-1234-5678"/>
          </div>

          <div className="mb-4">
            <label className="font-medium block mb-1">7. GBS 리더</label>
            <input className="w-full border rounded p-2" value={leader} onChange={e=>setLeader(e.target.value)} />
          </div>

          <div className="mb-6">
            <label className="font-medium block mb-1">8. 새돌/새가족/현역군지체</label>
            <select className="w-full border rounded p-2" value={special} onChange={e=>setSpecial(e.target.value)}>
              <option value="">선택 안 함</option>
              <option value="2026 새돌">2026 새돌</option>
              <option value="새가족">새가족</option>
              <option value="현역 군지체">현역 군지체</option>
            </select>
          </div>

          {/* 9. 출석 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium">9. 참석 일정</div>
              <div className="flex gap-2">
                <button type="button" onClick={selectAll} className="px-3 py-1 rounded bg-yellow-200">전체 선택</button>
                <button type="button" onClick={clearAll} className="px-3 py-1 rounded bg-yellow-200">전체 해제</button>
              </div>
            </div>
            <div className="overflow-x-auto relative">
              <table className="w-full border-collapse text-center">
                <thead>
                  <tr>
                    <th className="border p-2 bg-gray-100 w-24"></th>
                    {dayLabels.map(dl=><th key={dl} className="border p-2 bg-gray-100">{dl}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rowKeys.map(r=>(
                    <tr key={r.key}>
                      <td className="border p-2 bg-gray-50 font-semibold">{r.label}</td>
                      {dayKeys.map(dk=>{
                        const k=`${dk}-${r.key}`;
                        const disabled = !!disabledMap[k];
                        return (
                          <td key={k} className="border p-2">
                            <input type="checkbox" checked={!!selectedCells[k]} disabled={disabled} onChange={()=>toggleCell(dk,r.key)} className={`h-5 w-5 ${disabled?'opacity-30 cursor-not-allowed':'cursor-pointer'}`} />
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

          {/* 10. 확인 */}
          <div className="mb-6 bg-[#fff3cd] border border-[#ffeeba] rounded p-4 text-sm">
            <div className="font-medium mb-2">10. 꼭 확인</div>
            <label className="flex items-center gap-2 mt-3">
              <input type="checkbox" checked={paid} onChange={e=>setPaid(e.target.checked)} />
              <span className="font-semibold text-green-700">입금 완료했습니다!</span>
            </label>

            <div className="mt-3">
              <span className="font-semibold">💳 {department || "부서 선택 전"} 부 등록계좌:</span>
              <div className="mt-1 pl-1 text-base font-bold text-red-700 flex items-center gap-2">
                {accountText}
                <button onClick={()=>navigator.clipboard.writeText(accountText)} className="text-gray-600 hover:text-black text-xl" aria-label="계좌번호 복사">📋</button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button onClick={handleSubmit} className="w-full bg-[#fdf1b5] py-3 rounded text-base font-medium">제출하기</button>
          </div>

        </div>
      </div>
    </div>
  );
}
