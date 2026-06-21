'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { getQuranUrl } from '../../services/pageIndex';
import ModalSlot from '../ModalSlot';
import icons from '../../services/icons';
import { juz, arNum } from '../../services/filters';

export default function BookmarksModal() {
  const router = useRouter();
  const { setModal, readViewEnabled, setCurrentVerse, setHighlightCurrentVerse, readViewRef } = useApp();
  const [hide, setHide] = useState(false);
  const [tab, setTab] = useState('verse');
  const [tabs] = useState([
    { text: 'أية', tab: 'verse', checked: true },
    { text: 'صفحة', tab: 'page', checked: true },
  ]);
  const [bookmarks, setBookmarks] = useState(
    () => JSON.parse(localStorage.getItem('bookmarks')) || []
  );
  const [highlightedVerses, setHighlightedVerses] = useState(
    () => JSON.parse(localStorage.getItem('highlightedVerses')) || []
  );

  const removeVerse = (obj) => {
    window.oConfirm({
      title: 'المفضلة',
      desc: 'هل تريد حذف هذه الأية؟',
      btns: { cancel: { exists: true, text: 'الغاء' }, okay: { text: 'نعم' } },
    }).then(res => {
      if (res) {
        const updated = highlightedVerses.filter(item => item.globalVerse !== obj.globalVerse);
        setHighlightedVerses(updated);
        localStorage.setItem('highlightedVerses', JSON.stringify(updated));
      }
    });
  };

  const removePage = (obj) => {
    window.oConfirm({
      title: 'المفضلة',
      desc: 'هل تريد حذف هذه الصفحة؟',
      btns: { cancel: { exists: true, text: 'الغاء' }, okay: { text: 'نعم' } },
    }).then(res => {
      if (res) {
        const updated = bookmarks.filter(item => item.page !== obj.page);
        setBookmarks(updated);
        localStorage.setItem('bookmarks', JSON.stringify(updated));
      }
    });
  };

  const navigateTo = (page, globalVerse = null) => {
    setHide(true);
    if (globalVerse !== null) {
      setCurrentVerse(globalVerse);
      setHighlightCurrentVerse(true);
    } else {
      setCurrentVerse(null);
      setHighlightCurrentVerse(null);
    }
    if (readViewEnabled && readViewRef.current) {
      readViewRef.current.setPage(+page);
    } else {
      router.push(getQuranUrl(+page));
    }
  };

  const goTo = (e) => {
    if (e.target.nodeName !== 'LI') return;
    const verseAttr = e.target.getAttribute('data-verse');
    const pageAttr = e.target.getAttribute('data-page');
    if (verseAttr) {
      const [page, globalVerse] = verseAttr.split('-');
      navigateTo(page, globalVerse);
    } else if (pageAttr) {
      navigateTo(pageAttr);
    }
  };

  return (
    <ModalSlot name="bookmark" hide={hide}>
      <div className="bookmark-inner w-full min-h-[70px] mt-[5px] rounded-[3px] border border-[#e8dcc8]">
        <nav className="bookmark-nav px-[10px] pl-[35px] pb-[5px] pt-[10px] border-b border-[#e8dcc8] relative bg-[#fdf8f0]">
          <ul className="m-0 p-0 pb-[5px] pl-[5px] list-none flex whitespace-nowrap overflow-auto scrollbar">
            {tabs.map((item, index) => item.tab && (
              <li
                key={index}
                className={[
                  'hidden cursor-pointer px-[10px] pt-[5px] pb-[2.5px] rounded-[50px] ml-[10px] border border-[#eee] select-none last:ml-0',
                  item.tab === tab ? 'bg-gradient-to-r from-[#c8952a] to-[#e8b85a] border-[#c8952a] [&>a]:text-[#1a0f00] [&>a]:font-bold' : '',
                  item.checked ? '!inline-block' : '',
                ].join(' ')}
                onClick={() => setTab(item.tab)}
              >
                <a className="pointer-events-none no-underline text-center block text-[14px] text-[#666] font-tajawal">
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <ul className="m-0 p-[10px] list-none overflow-auto h-[calc(100vh-170px)] scrollbar" onClick={goTo}>
            {tab === 'verse' && (
              <>
                {highlightedVerses.map((item, index) => (
                  <li
                    key={index}
                    className="result-item border-b border-[#eee] py-[10px] rounded-[3px] cursor-pointer overflow-hidden first:pt-0 last:border-0 last:pb-0 hover:[&>a]:text-[#647eff]"
                    data-verse={`${item.page}-${item.globalVerse}`}
                  >
                    <div className="verseInfo pointer-events-none overflow-hidden select-none">
                      <span className="verseInfo__name select-none text-xs font-bold text-[#666] font-kitab float-left">{item.name}</span>
                      <span className="verseInfo__juz select-none text-xs font-bold text-[#666] font-kitab float-right ml-[5px]">{juz(item.juz)}</span>
                      <span className="verseInfo__separator select-none text-xs font-bold text-[#666] font-kitab float-right ml-[5px]">-</span>
                      <span className="verseInfo__page select-none text-xs font-bold text-[#666] font-kitab float-right ml-[5px]">صفحة {arNum(item.page)}</span>
                    </div>
                    <a className="block font-kitab text-[20px] font-bold text-[#666] no-underline px-[5px] py-[10px] rounded-[3px] transition-[background_0.1s_ease] select-none pointer-events-none">
                      {item.text}
                      <span className="pointer-events-none font-[Arial,sans-serif] w-[35px] h-[35px] leading-[35px] rounded-full inline-block text-[14px] text-center mx-[8px] select-none bg-gradient-to-br from-[#c8952a] to-[#e8b85a] text-[#1a0f00] shadow-[0_0_3px_1px_rgba(0,0,0,0.15)]">
                        {arNum(item.localVerse)}
                      </span>
                      <button
                        className="o-btn !w-[35px] !h-[35px] !rounded-full p-0 relative top-[11px] border-transparent m-0 pointer-events-auto !bg-[#f94c66]"
                        onClick={(e) => { e.stopPropagation(); removeVerse(item); }}
                        dangerouslySetInnerHTML={{ __html: icons.close }}
                      />
                    </a>
                  </li>
                ))}
                {!highlightedVerses.length && (
                  <div className="empty-msg text-center my-[10px] text-[#666] select-none">لايوجد أيات محفوظة</div>
                )}
              </>
            )}
            {tab === 'page' && (
              <>
                {bookmarks.map((item, index) => (
                  <li
                    key={index}
                    className="result-item border-b border-[#eee] py-[10px] rounded-[3px] cursor-pointer overflow-hidden first:pt-0 last:border-0 last:pb-0"
                    data-page={item.page}
                  >
                    <div className="pointer-events-none float-right select-none">
                      <span className="surahInfo__page select-none font-bold font-[Arial,sans-serif] text-[14px] ml-[10px] w-[35px] h-[35px] p-0 rounded-full relative border-transparent float-right text-center leading-[38px] bg-gradient-to-br from-[#c8952a] to-[#e8b85a] text-[#1a0f00]">
                        {arNum(item.page)}
                      </span>
                      <span className="surahInfo__name select-none font-bold text-[#666] font-kitab text-[20px]">
                        سُورَةُ {item.name}
                      </span>
                    </div>
                    <button
                      className="o-btn !w-[35px] !h-[35px] p-0 !rounded-full border-transparent !bg-[#f94c66] float-left m-[2px] relative"
                      onClick={(e) => { e.stopPropagation(); removePage(item); }}
                      dangerouslySetInnerHTML={{ __html: icons.close }}
                    />
                  </li>
                ))}
                {!bookmarks.length && (
                  <div className="empty-msg text-center my-[10px] text-[#666] select-none">لايوجد صفحات محفوظة</div>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </ModalSlot>
  );
}
