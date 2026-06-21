'use client';
import { useState } from 'react';
import ModalSlot from '../ModalSlot';
import icons from '../../services/icons';
import { arNum } from '../../services/filters';

function handleDate(str) {
  return str.replace(/t.*/gi, '').split('-').reverse().join(' - ');
}

export default function Completion() {
  const [completion, setCompletion] = useState(
    () => JSON.parse(localStorage.getItem('completion')) || []
  );

  const remove = (obj) => {
    window.oConfirm({
      title: 'الختمات',
      desc: 'هل تريد حذف هذه الختمة؟',
      btns: { cancel: { exists: true, text: 'الغاء' }, okay: { text: 'نعم' } },
    }).then(res => {
      if (res) {
        const updated = completion.filter(item => item.id !== obj.id);
        setCompletion(updated);
        localStorage.setItem('completion', JSON.stringify(updated));
      }
    });
  };

  return (
    <ModalSlot name="completion">
      <div className="w-full min-h-[70px] mt-[5px] rounded-[3px] border border-[#d8d8d8]">
        <div>
          <ul className="m-0 p-[10px] list-none overflow-auto h-[calc(100vh-120px)] scrollbar">
            {completion.map((item, index) => (
              <li
                key={index}
                className="border-b border-[#eee] py-[10px] rounded-[3px] cursor-pointer overflow-hidden first:pt-0 last:border-0 last:pb-0"
              >
                <span className="done-time pointer-events-none select-none float-right text-[#666] tracking-[2px] font-bold leading-[35px] font-tajawal">
                  {arNum(handleDate(item.time))}
                </span>
                <button
                  className="o-btn !w-[35px] !h-[35px] p-0 !rounded-full border-transparent !bg-[#f94c66] float-left m-[2px] relative"
                  onClick={() => remove(item)}
                  dangerouslySetInnerHTML={{ __html: icons.close }}
                />
              </li>
            ))}
            {!completion.length && (
              <div className="empty-msg text-center my-[10px] text-[#666] select-none">
                لايوجد ختمات محفوظة
              </div>
            )}
          </ul>
        </div>
      </div>
    </ModalSlot>
  );
}
