"use client";
import { useState } from "react";
import ModalSlot from "../ModalSlot";
import { arNum } from "../../services/filters";
import { useApp } from "../../context/AppContext";

const initialArray = [
  { text: "سبحان الله", count: 33, num: 0 },
  { text: "الحمد لله", count: 33, num: 0 },
  { text: "الله اكبر", count: 33, num: 0 },
  { text: "اخري", num: 0 },
];

function CircleProgress({ current, total, done, isDark }) {
  const size = 220;
  const strokeW = 3;
  const r = size / 2 - strokeW * 2;
  const circ = 2 * Math.PI * r;
  const progress = total ? Math.min(current / total, 1) : 0;
  const offset = circ * (1 - progress);

  const gold = isDark ? "#d4a843" : "#c8952a";
  const track = isDark ? "rgba(212,168,67,0.12)" : "rgba(200,149,42,0.15)";
  const arc = done ? (isDark ? "rgba(80,210,160,0.9)" : "#28a064") : gold;

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={strokeW} />
        {total && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={arc}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeDasharray={`${circ} ${circ}`}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.25s ease, stroke 0.3s ease" }}
          />
        )}
      </svg>
      <span className="tasbih-text text-5xl font-tajawal font-bold z-10" style={{ color: isDark ? "#d4a843" : "#2a1a00" }}>
        {arNum(current)}
      </span>
    </div>
  );
}

export default function Tasbih() {
  const { isDark } = useApp();
  const [items, setItems] = useState(() => initialArray.map((o) => ({ ...o })));
  const [active, setActive] = useState(0);

  const item = items[active];
  const done = item.count ? item.num >= item.count : false;

  const navigate = (d) => setActive((a) => Math.max(0, Math.min(items.length - 1, a + d)));

  const increment = () => {
    if (done) return;
    setItems((prev) =>
      prev.map((o, i) => {
        if (i !== active) return o;
        if (o.count && o.num >= o.count) return o;
        return { ...o, num: o.num + 1 };
      })
    );
  };

  const reset = () => setItems((prev) => prev.map((o, i) => (i === active ? { ...o, num: 0 } : o)));

  const gold = isDark ? "#d4a843" : "#c8952a";
  const muted = isDark ? "rgba(250,240,220,0.35)" : "rgba(42,26,0,0.35)";
  const border = isDark ? "rgba(212,168,67,0.15)" : "rgba(200,149,42,0.15)";
  const dotOff = isDark ? "rgba(212,168,67,0.2)" : "rgba(200,149,42,0.2)";

  return (
    <ModalSlot name="tasbih">
      <div dir="rtl" className="flex flex-col items-center justify-between h-full cursor-pointer select-none" onClick={increment}>
        {/* Header + circle */}
        <div className="flex flex-col items-center gap-2 pt-5 w-full">
          <p className="text-[11px] font-tajawal tracking-widest" style={{ color: muted }}>
            المسبحة
          </p>
          <h2 className="modal-heading text-[28px] font-bold font-tajawal leading-tight m-0 border-0 pb-0">{item.text}</h2>
          <p className="text-sm font-tajawal" style={{ color: muted }}>
            {item.count ? `${arNum(item.count)} مرة` : "بلا حد"}
          </p>
          <CircleProgress current={item.num} total={item.count} done={done} isDark={isDark} />
        </div>

        {/* Footer — stop propagation so clicks here don't increment */}
        <div className="w-full pb-5 px-4" onClick={(e) => e.stopPropagation()}>
          {/* Nav */}
          <div className="flex items-center justify-center gap-4 mb-5">
            <button
              onClick={() => navigate(1)}
              disabled={active === items.length - 1}
              className="w-12 h-12 rounded-full flex items-center justify-center text-[22px] leading-none transition-opacity active:scale-95"
              style={{ color: gold, border: `1px solid ${gold}`, opacity: active === items.length - 1 ? 0.25 : 0.7 }}
            >
            <span className="relative top-[2px] left-[1px]">‹</span>
            </button>

            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="h-[7px] rounded-full transition-all duration-300"
                style={{ width: i === active ? 20 : 7, background: i === active ? gold : dotOff }}
              />
            ))}
            <button
              onClick={() => navigate(-1)}
              disabled={active === 0}
              className="w-12 h-12 rounded-full flex items-center justify-center text-[22px] leading-none transition-opacity active:scale-95"
              style={{ color: gold, border: `1px solid ${gold}`, opacity: active === 0 ? 0.25 : 0.7 }}
            >
            <span className="relative top-[2px] left-[1px]">›</span>
            </button>
          </div>
          {/* Reset */}
          <div className="text-center">
            <button
              onClick={reset}
              className="text-xs font-tajawal rounded-full px-6 py-[5px]"
              style={{ color: muted, border: `1px solid ${border}` }}
            >
              تصفير
            </button>
          </div>
        </div>
      </div>
    </ModalSlot>
  );
}
