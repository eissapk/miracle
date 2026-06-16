'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import icons from '../services/icons';
import solid_book_open from 'olum-icons/dist/fa/solid_book_open';
import solid_search from 'olum-icons/dist/fa/solid_search';
import solid_bookmark from 'olum-icons/dist/fa/solid_bookmark';
import solid_hands from 'olum-icons/dist/fa/solid_hands';
import { arNum } from '../services/filters';

const defaultLastRead = {
  juz: 1, page: 1, name: 'ٱلْفَاتِحَةِ', type: 'mec', surah: 1, verses: 7,
};

const tabBase = 'tab-card relative p-[10px] rounded-[5px] text-white bg-gradient-to-r from-[#6a11cb] to-[#2f70ec] cursor-pointer';
const iconBase = 'float-right ml-[10px] [&>svg]:w-[20px] [&>svg]:h-[20px] [&>svg]:fill-white [&>svg]:block';

export default function HomePage() {
  const { setModal, audioRef } = useApp();
  const [lastRead, setLastRead] = useState(defaultLastRead);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('lastRead')) || defaultLastRead;
    setLastRead(saved);
    setPercent(Math.floor((saved.page / 604) * 100));
    if (audioRef.current) audioRef.current.src = '';
  }, []);

  const saveCompletion = () => {
    const arr = JSON.parse(localStorage.getItem('completion')) || [];
    arr.push({ id: new Date().getTime(), time: new Date().toISOString() });
    localStorage.setItem('completion', JSON.stringify(arr));
    const reset = defaultLastRead;
    localStorage.setItem('lastRead', JSON.stringify(reset));
    setLastRead(reset);
    setPercent(0);
  };

  const showModal = (name) => setModal({ name, data: null });

  return (
    <div className="grid gap-[10px] select-none">
      {/* read */}
      <div className={`${tabBase} [grid-row:1/2] [grid-column:1/3] [&_*]:pointer-events-none`}>
        <Link href={'/read/' + lastRead.page} className="absolute left-0 top-0 w-full h-full bg-transparent no-underline !pointer-events-auto outline-none shadow-none border-none" />
        <img src="/img/book.png" alt="book" className="absolute left-[10px] bottom-[10px] w-auto h-[calc(100%-60px)]" />
        <p className="m-0 mb-[10px] font-bold">
          <span className={`${iconBase} inline-block ml-[5px] align-middle`} dangerouslySetInnerHTML={{ __html: solid_book_open }} />
          اخر قراءة
        </p>
        <p className="m-0 mb-[10px] font-bold text-[18px] font-kitab">سُورَةُ {lastRead.name}</p>
        <div className="w-[calc(100%-150px)]">
          <p className="m-0 mb-[5px] font-bold font-tajawal tracking-[2px]">{arNum(percent)}%</p>
          <div className="relative h-[5px] bg-black/20 rounded-[5px]">
            <span className="absolute right-0 top-0 h-full bg-white rounded-[5px] transition-[width_0.3s_ease-in-out]" style={{ width: percent + '%' }} />
          </div>
        </div>
        {percent === 100 && (
          <button
            onClick={saveCompletion}
            className="pointer-events-auto relative z-[1] inline-block mt-[10px] px-[16px] py-[6px] text-xs font-bold font-tajawal text-white bg-white/[0.18] border border-white/50 rounded-[20px] cursor-pointer outline-none transition-[background_0.2s_ease] hover:bg-white/[0.28] active:bg-white/40"
          >
            احفظ الختمة
          </button>
        )}
      </div>

      {/* search */}
      <div className={`${tabBase} [grid-row:2/3] [grid-column:1/2] py-[15px]`}>
        <button className="absolute left-0 top-0 w-full h-full bg-transparent pointer-events-auto outline-none shadow-none border-none" onClick={() => showModal('search')} />
        <p className="font-bold m-0">
          <span className={iconBase} dangerouslySetInnerHTML={{ __html: solid_search }} />
          <span className="align-sub">بحث</span>
        </p>
      </div>

      {/* bookmarks */}
      <div className={`${tabBase} [grid-row:2/3] [grid-column:2/3] py-[15px]`}>
        <button className="absolute left-0 top-0 w-full h-full bg-transparent pointer-events-auto outline-none shadow-none border-none" onClick={() => showModal('bookmarks')} />
        <p className="font-bold m-0">
          <span className={iconBase} dangerouslySetInnerHTML={{ __html: solid_bookmark }} />
          <span className="align-sub">المفضلة</span>
        </p>
      </div>

      {/* doaa */}
      <div className={`${tabBase} [grid-row:3/4] [grid-column:1/3] py-[15px]`}>
        <button className="absolute left-0 top-0 w-full h-full bg-transparent pointer-events-auto outline-none shadow-none border-none" onClick={() => showModal('doaa')} />
        <p className="font-bold m-0">
          <span className={iconBase} dangerouslySetInnerHTML={{ __html: solid_hands }} />
          <span className="align-sub">دعاء ختم القرآن</span>
        </p>
      </div>

      {/* azkar */}
      <div className={`${tabBase} [grid-row:4/5] [grid-column:1/2] py-[15px]`}>
        <button className="absolute left-0 top-0 w-full h-full bg-transparent pointer-events-auto outline-none shadow-none border-none" onClick={() => showModal('azkar')} />
        <p className="font-bold m-0">
          <span className={iconBase} dangerouslySetInnerHTML={{ __html: solid_hands }} />
          <span className="align-sub">اذكار</span>
        </p>
      </div>

      {/* tasbih */}
      <div className={`${tabBase} [grid-row:4/5] [grid-column:2/3] py-[15px]`}>
        <button className="absolute left-0 top-0 w-full h-full bg-transparent pointer-events-auto outline-none shadow-none border-none" onClick={() => showModal('tasbih')} />
        <p className="font-bold m-0">
          <span className={iconBase} dangerouslySetInnerHTML={{ __html: icons.tasbih }} />
          <span className="align-sub">تسبيح</span>
        </p>
      </div>

      {/* completion */}
      <div className={`${tabBase} [grid-row:5/6] [grid-column:1/3] py-[15px]`}>
        <button className="absolute left-0 top-0 w-full h-full bg-transparent pointer-events-auto outline-none shadow-none border-none" onClick={() => showModal('completion')} />
        <p className="font-bold m-0">
          <span className={iconBase} dangerouslySetInnerHTML={{ __html: solid_book_open }} />
          <span className="align-sub">الختمات</span>
        </p>
      </div>
    </div>
  );
}
