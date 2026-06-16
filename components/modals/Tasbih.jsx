'use client';
import { useState, useRef } from 'react';
import ModalSlot from '../ModalSlot';
import { arNum } from '../../services/filters';

const initialArray = [
  { text: 'سبحان الله', count: 33, num: 0 },
  { text: 'الحمد لله', count: 33, num: 0 },
  { text: 'الله اكبر', count: 33, num: 0 },
  { text: 'اخري', num: 0 },
];

export default function Tasbih() {
  const [array, setArray] = useState(() => initialArray.map(obj => ({ ...obj })));
  const btnRefs = useRef([]);

  const handleCounter = (index) => {
    setArray(prev => {
      const next = prev.map((obj, i) => {
        if (i !== index) return obj;
        if (obj.count) {
          if (obj.num < obj.count) return { ...obj, num: obj.num + 1 };
        } else {
          return { ...obj, num: obj.num + 1 };
        }
        return obj;
      });
      return next;
    });
  };

  const resetItem = (index) => {
    setArray(prev => prev.map((obj, i) => i === index ? { ...obj, num: 0 } : obj));
  };

  return (
    <ModalSlot name="tasbih">
      <div className="pl-[10px]">
        <h3 className="modal-heading m-0 border-b-2 border-[#6a11cb] inline-block pb-[5px] mb-[20px] text-[#333]">
          المسبحة
        </h3>
        <div>
          {array.map((obj, index) => (
            <p
              key={index}
              className="grid grid-cols-3 items-center justify-items-center text-[#666] leading-[30px] my-[20px] first:mt-0 text-[18px] font-tajawal"
            >
              <span className="tasbih-text">{obj.text}</span>
              <button
                className={`o-btn rounded-full w-10 h-10 text-[18px] tracking-[1px]${obj.count && obj.num >= obj.count ? ' blue' : ''}`}
                onClick={() => handleCounter(index)}
              >
                {arNum(obj.num)}
              </button>
              <button className="o-btn blue text-xs font-tajawal font-bold float-left" onClick={() => resetItem(index)}>
                تصفير
              </button>
            </p>
          ))}
        </div>
      </div>
    </ModalSlot>
  );
}
