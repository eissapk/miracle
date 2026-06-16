'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import NotFound from '../../../components/NotFound';
import OptionsRect from '../../../components/modals/OptionsRect';
import icons from '../../../services/icons';
import { arNum, juz, surahType, highlight } from '../../../services/filters';

const START = 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ';
const GOD_ARR = ['اللهم','اله','واحد','هو','لله','الله','رب','ربهم','ربكم','ربك','ربه','ربنا','لرب','ربي','ربها','لربك','ربكما','ربهما','ربها'];

const defaultOptions = { reciter: 'mahermuaiqly', explainer: 'muyassar', translator: 'ahmedraza' };

export default function ReadPage() {
  const { page: pageParam } = useParams();
  const router = useRouter();
  const { setModal, setReadViewEnabled, audioRef, readViewRef, currentVerse, highlightCurrentVerse, setHighlightCurrentVerse } = useApp();

  const pageNum = useRef(+pageParam);
  const [currentPage, setCurrentPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSajda, setHasSajda] = useState(false);
  const [pageLeft, setPageLeft] = useState(0);
  const [optionsRectShown, setOptionsRectShown] = useState(false);
  const [highlightTick, setHighlightTick] = useState(0);
  const [optionsData, setOptionsData] = useState({
    coords: { top: 0, left: 0, right: 0, width: 0, elm: null },
    obj: null,
    reciter: defaultOptions.reciter,
    explainer: defaultOptions.explainer,
    translator: defaultOptions.translator,
  });
  const [isAuto, setIsAuto] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialPlaying, setIsInitialPlaying] = useState(false);
  const [notifyShown, setNotifyShown] = useState(false);
  const [notifyDesc, setNotifyDesc] = useState('');
  const [notifyClass, setNotifyClass] = useState('');
  const [isBookmarkDisabled, setIsBookmarkDisabled] = useState(false);
  const [displayNum, setDisplayNum] = useState(pageNum.current);
  const [playingVerse, setPlayingVerse] = useState(null);

  const pageRef = useRef(null);
  const barRef = useRef(null);
  const isScrollingRef = useRef(false);
  const intervalRef = useRef(null);
  const notifyTimerRef = useRef(null);
  const scrollUpdateCleanupRef = useRef(null);

  const getLastReadObj = (arr) => {
    const f = arr[0];
    return { juz: f.juz, page: f.page, name: f.name, type: f.type, surah: f.surah, verses: f.verses };
  };

  const getSurahName = useCallback((page) => {
    if (!page || !page.length) return '';
    const firstSurahName = page[0].name;
    const secondSurahName = page[page.length - 1].name;
    const firstLens = page.filter(o => o.surah === page[0].surah).map(o => o.text.length);
    const secondLens = page.filter(o => o.surah !== page[0].surah).map(o => o.text.length);
    const maxFirst = firstLens.length ? Math.max(...firstLens) : 0;
    const maxSecond = secondLens.length ? Math.max(...secondLens) : 0;
    return maxFirst >= maxSecond ? firstSurahName : secondSurahName;
  }, []);

  const loadPage = useCallback((num) => {
    const pg = window.pages?.[num];
    if (pg) {
      setCurrentPage(pg);
      setHasSajda(!!pg.find(item => item.sajda));
      localStorage.setItem('lastRead', JSON.stringify(getLastReadObj(pg)));
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const num = pageNum.current;
    if (isNaN(num) || num < 1 || num > 604) {
      setIsLoading(true);
      return;
    }

    const saved = JSON.parse(localStorage.getItem('optionsData')) || defaultOptions;
    const savedAuto = JSON.parse(localStorage.getItem('autoReciting')) || false;
    setIsAuto(savedAuto);
    setOptionsData(prev => ({ ...prev, reciter: saved.reciter, explainer: saved.explainer, translator: saved.translator }));

    if (window.pages) {
      loadPage(num);
    } else {
      setIsLoading(true);
      intervalRef.current = setInterval(() => {
        if (window.pages) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          loadPage(num);
        }
      }, 1);
      setTimeout(() => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, 5000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loadPage]);

  const next = useCallback(() => {
    const num = Math.min(pageNum.current + 1, 604);
    pageNum.current = num;
    setDisplayNum(num);
    const pg = window.pages?.[num];
    if (!pg) return;
    setCurrentPage(pg);
    setHasSajda(!!pg.find(item => item.sajda));
    window.history.replaceState(null, '', '/read/' + num);
    setOptionsRectShown(false);
    localStorage.setItem('lastRead', JSON.stringify(getLastReadObj(pg)));
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  const prev = useCallback(() => {
    const num = Math.max(pageNum.current - 1, 1);
    pageNum.current = num;
    setDisplayNum(num);
    const pg = window.pages?.[num];
    if (!pg) return;
    setCurrentPage(pg);
    setHasSajda(!!pg.find(item => item.sajda));
    window.history.replaceState(null, '', '/read/' + num);
    setOptionsRectShown(false);
    localStorage.setItem('lastRead', JSON.stringify(getLastReadObj(pg)));
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  useEffect(() => {
    setReadViewEnabled(true);

    const setPage = (num) => {
      pageNum.current = num;
      setDisplayNum(num);
      const pg = window.pages?.[num];
      if (!pg) return;
      setCurrentPage(pg);
      setHasSajda(!!pg.find(item => item.sajda));
      window.history.replaceState(null, '', '/read/' + num);
      setOptionsRectShown(false);
      localStorage.setItem('lastRead', JSON.stringify(getLastReadObj(pg)));
      window.scrollTo({ top: 0, left: 0 });
    };

    readViewRef.current = { setPage };

    return () => {
      setReadViewEnabled(false);
      readViewRef.current = null;
    };
  }, [setReadViewEnabled, readViewRef]);

  useEffect(() => {
    if (!currentPage) return;
    const handleKey = (e) => {
      if (e.keyCode === 39) next();
      else if (e.keyCode === 37) prev();
    };
    document.body.addEventListener('keydown', handleKey);
    return () => document.body.removeEventListener('keydown', handleKey);
  }, [currentPage, next, prev]);

  useEffect(() => {
    if (!currentPage || !pageRef.current) return;
    const page = pageRef.current;
    let isDown = false;
    let startX = 0;
    let distance = 0;
    let direction = '';
    const threshold = 150;

    const dragEnd = () => {
      isScrollingRef.current = false;
      isDown = false;
      if (distance >= threshold) {
        page.classList.add('pauseAnimation');
        setPageLeft(0);
        if (direction === 'left') prev();
        else next();
      } else {
        page.classList.remove('pauseAnimation');
        setPageLeft(0);
      }
      distance = 0;
      direction = '';
      page.removeEventListener('touchmove', dragMove);
      page.removeEventListener('touchend', dragEnd);
    };

    const dragMove = (e) => {
      if (!isDown) return;
      const currentX = Math.round(e.touches[0].clientX);
      const walkX = currentX - startX;
      direction = walkX > 0 ? 'right' : 'left';
      distance = Math.abs(walkX);
      if (distance <= threshold && !isScrollingRef.current) setPageLeft(walkX);
    };

    const dragStart = (e) => {
      e.stopPropagation();
      isDown = true;
      startX = Math.round(e.touches[0].clientX);
      page.addEventListener('touchmove', dragMove);
      page.addEventListener('touchend', dragEnd);
    };

    page.addEventListener('touchstart', dragStart);
    return () => {
      page.removeEventListener('touchstart', dragStart);
    };
  }, [currentPage, next, prev]);

  useEffect(() => {
    if (!optionsRectShown) return;
    const handleDocClick = (e) => {
      const rect = document.querySelector('.OptionsRect');
      const elm = optionsData.coords.elm;
      if (rect && !rect.contains(e.target) && elm && !elm.contains(e.target)) {
        setOptionsRectShown(false);
        document.querySelectorAll('.page .verse').forEach(v => v.classList.remove('selected'));
      }
    };
    document.addEventListener('click', handleDocClick, true);
    return () => document.removeEventListener('click', handleDocClick, true);
  }, [optionsRectShown, optionsData.coords.elm]);

  useEffect(() => {
    if (!playingVerse) return;
    const el = document.getElementById('verse_' + playingVerse);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      el.classList.add('selected');
    }
  }, [playingVerse, currentPage]);

  useEffect(() => {
    if (!highlightCurrentVerse || !currentVerse) return;
    const verseElm = document.getElementById('verse_' + currentVerse);
    if (verseElm) {
      verseElm.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      verseElm.classList.add('red');
      setTimeout(() => {
        verseElm.classList.remove('red');
        setHighlightCurrentVerse(false);
      }, 3000);
    }
  }, [highlightCurrentVerse, currentVerse, currentPage]);

  const showNotify = useCallback((desc, cls = '', duration = 1000) => {
    if (notifyTimerRef.current) clearTimeout(notifyTimerRef.current);
    setNotifyDesc(desc);
    setNotifyClass(cls);
    setNotifyShown(true);
    notifyTimerRef.current = setTimeout(() => {
      setNotifyShown(false);
      setNotifyDesc('');
      setNotifyClass('');
      setIsBookmarkDisabled(false);
    }, duration);
  }, []);

  const getHighlightedVerseColor = (obj) => {
    const arr = JSON.parse(localStorage.getItem('highlightedVerses')) || [];
    const found = arr.find(item => item.globalVerse === obj.globalVerse);
    return found ? found.color : null;
  };

  const deselectVerses = () => {
    document.querySelectorAll('.page .verse').forEach(v => v.classList.remove('selected'));
  };

  const showVerseOpt = (obj, e) => {
    const verseElm = e.currentTarget;
    deselectVerses();
    verseElm.classList.add('selected');
    const rect = verseElm.getBoundingClientRect();
    setOptionsData(prev => ({
      ...prev,
      coords: { top: rect.top, left: rect.left, right: rect.right, width: rect.width, elm: verseElm },
      obj,
    }));
    setOptionsRectShown(true);

    if (scrollUpdateCleanupRef.current) scrollUpdateCleanupRef.current();
    const updateTop = () => {
      const r = verseElm.getBoundingClientRect();
      setOptionsData(prev => ({ ...prev, coords: { ...prev.coords, top: r.top } }));
    };
    window.addEventListener('scroll', updateTop);
    scrollUpdateCleanupRef.current = () => window.removeEventListener('scroll', updateTop);
  };

  const bookmarkPage = () => {
    setIsBookmarkDisabled(true);
    const obj = {
      juz: currentPage[0].juz,
      page: currentPage[0].page,
      name: getSurahName(currentPage),
      type: currentPage[0].type,
      surah: currentPage[0].surah,
      verses: currentPage[0].verses,
    };
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    if (!bookmarks.find(item => item.page === obj.page)) {
      bookmarks.push(obj);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      showNotify('تمت الاضافة للمفضلة');
    } else {
      showNotify('هذه الصفحة مضافة بالفعل', 'alert');
    }
  };

  const pauseReciting = () => { audioRef.current?.pause(); setIsPlaying(false); };
  const resumeReciting = () => { audioRef.current?.play(); setIsPlaying(true); };

  const handlePlayingUpdate = useCallback((update) => {
    if (update.networkHint) {
      showNotify(update.notifyDesc || 'انت غير متصل بالانترنت', update.notifyClass || 'alert', 2000);
      return;
    }
    if (update.isPlaying !== undefined) setIsPlaying(update.isPlaying);
    if (update.isInitialPlaying !== undefined) setIsInitialPlaying(update.isInitialPlaying);
  }, [showNotify]);

  const handleTextCopied = () => showNotify('تم النسخ');

  const handleHighlightChanged = () => {
    setOptionsRectShown(false);
    setHighlightTick(t => t + 1);
  };

  const saveOptionsData = (key, value) => {
    setOptionsData(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem('optionsData', JSON.stringify({ reciter: updated.reciter, explainer: updated.explainer, translator: updated.translator }));
      return updated;
    });
  };

  const handleAutoChange = (e) => {
    const val = e.target.checked;
    setIsAuto(val);
    localStorage.setItem('autoReciting', JSON.stringify(val));
  };

  if (isLoading) return <NotFound />;
  if (!currentPage) return null;

  const surahName = getSurahName(currentPage);

  return (
    <div>
      {notifyShown && (
        <div className={`NotifyModal ${notifyClass}`}>{notifyDesc}</div>
      )}

      {optionsRectShown && (
        <OptionsRect
          options={optionsData}
          isAuto={isAuto}
          onUpdate={handlePlayingUpdate}
          onTextCopied={handleTextCopied}
          onClose={handleHighlightChanged}
          onPlayVerse={setPlayingVerse}
        />
      )}

      {/* fixed navigation arrows */}
      <button
        className="nav-btn fixed top-1/2 -translate-y-1/2 z-[999] right-0 w-10 h-10 bg-gradient-to-r from-[#6a11cb] to-[#2f70ec] mx-[5px] rounded-full border-0 outline-none cursor-pointer opacity-20 hover:opacity-100 active:[transform:perspective(1px)_translateZ(-0.04px)_translateY(-50%)] active:transition-[200ms_cubic-bezier(0.12,0.8,0.32,1)]"
        dangerouslySetInnerHTML={{ __html: icons.next }}
        onClick={next}
      />
      <button
        className="nav-btn fixed top-1/2 -translate-y-1/2 z-[999] left-0 w-10 h-10 bg-gradient-to-r from-[#6a11cb] to-[#2f70ec] mx-[5px] rounded-full border-0 outline-none cursor-pointer opacity-20 hover:opacity-100 active:[transform:perspective(1px)_translateZ(-0.04px)_translateY(-50%)] active:transition-[200ms_cubic-bezier(0.12,0.8,0.32,1)]"
        dangerouslySetInnerHTML={{ __html: icons.prev }}
        onClick={prev}
      />

      <div
        className="relative transition-[left_0.3s_ease]"
        ref={pageRef}
        style={{ left: pageLeft + 'px' }}
      >
        <div className="page">
          {/* bar */}
          <div className="select-none overflow-hidden py-[5px] mb-[20px] relative" ref={barRef}>
            <span className="bar-label text-[15px] font-bold text-[#666] leading-[35px] border-b-2 border-[#6a11cb] float-left font-kitab">
              {surahName}
            </span>
            <div className="font-[Arial,sans-serif] text-[14px] font-bold w-10 h-10 leading-[40px] rounded-full bg-[#f94c66] text-center text-white shadow-[0_0_3px_1px_rgba(0,0,0,0.15)] m-auto absolute left-1/2 -translate-x-1/2 tracking-[1px]">
              {arNum(displayNum)}
            </div>
            <span className="bar-label text-xs font-bold text-[#666] leading-[35px] border-b-2 border-[#6a11cb] float-right tracking-[1px]">
              {juz(currentPage[0].juz)}
            </span>
          </div>

          {/* options */}
          <div className="overflow-hidden mb-[5px] py-[5px]">
            <button
              className="opt-btn float-right w-10 h-10 bg-gradient-to-r from-[#6a11cb] to-[#2f70ec] mx-[5px] rounded-full border-0 outline-none cursor-pointer active:[transform:perspective(1px)_translateZ(-0.04px)] active:transition-[200ms_cubic-bezier(0.12,0.8,0.32,1)]"
              dangerouslySetInnerHTML={{ __html: icons.home }}
              onClick={() => router.push('/')}
            />
            <button
              className="opt-btn float-right w-10 h-10 bg-gradient-to-r from-[#6a11cb] to-[#2f70ec] mx-[5px] rounded-full border-0 outline-none cursor-pointer active:[transform:perspective(1px)_translateZ(-0.04px)] active:transition-[200ms_cubic-bezier(0.12,0.8,0.32,1)]"
              dangerouslySetInnerHTML={{ __html: icons.search }}
              onClick={() => setModal({ name: 'search', data: null })}
            />
            <button
              disabled={isBookmarkDisabled}
              className={`opt-btn float-right w-10 h-10 bg-gradient-to-r from-[#6a11cb] to-[#2f70ec] mx-[5px] rounded-full border-0 outline-none cursor-pointer active:[transform:perspective(1px)_translateZ(-0.04px)] active:transition-[200ms_cubic-bezier(0.12,0.8,0.32,1)]${isBookmarkDisabled ? ' disabled' : ''}`}
              dangerouslySetInnerHTML={{ __html: icons.bookmark }}
              onClick={bookmarkPage}
            />
            {isInitialPlaying && (
              isPlaying ? (
                <button
                  className="opt-btn float-right w-10 h-10 bg-gradient-to-r from-[#6a11cb] to-[#2f70ec] mx-[5px] rounded-full border-0 outline-none cursor-pointer active:[transform:perspective(1px)_translateZ(-0.04px)] active:transition-[200ms_cubic-bezier(0.12,0.8,0.32,1)]"
                  dangerouslySetInnerHTML={{ __html: icons.pause }}
                  onClick={pauseReciting}
                />
              ) : (
                <button
                  className="opt-btn float-right w-10 h-10 bg-gradient-to-r from-[#6a11cb] to-[#2f70ec] mx-[5px] rounded-full border-0 outline-none cursor-pointer active:[transform:perspective(1px)_translateZ(-0.04px)] active:transition-[200ms_cubic-bezier(0.12,0.8,0.32,1)]"
                  dangerouslySetInnerHTML={{ __html: icons.playSolid }}
                  onClick={resumeReciting}
                />
              )
            )}
            {isInitialPlaying && (
              <label className="auto-label inline-block h-10 leading-[45px] font-tajawal text-xs font-bold text-[#666] select-none">
                <input
                  type="checkbox"
                  className="o-switch-btn scale-[1.3] mx-[10px] ml-[15px] mt-[10px] float-right"
                  checked={isAuto}
                  onChange={handleAutoChange}
                />
                تلقائي
              </label>
            )}
          </div>

          {/* page content */}
          <div className={`page-content relative${hasSajda ? ' has-sajda' : ''}`}>
            {currentPage.map((obj, index) => (
              <span key={index}>
                {obj.localVerse === 1 && (
                  <div className="page-head text-white bg-gradient-to-r from-[#6a11cb] to-[#2f70ec] text-[18px] text-center mb-[10px] rounded-[50px] py-[20px] select-none max-w-[200px] mx-auto my-[20px]">
                    <p className="font-[Arial,sans-serif] w-[30px] h-[30px] leading-[30px] rounded-full mx-auto mb-[10px] bg-white text-[#666] text-xs font-bold m-0">
                      {arNum(obj.surah)}
                    </p>
                    <p className="font-bold text-[20px] font-kitab m-0 mb-[5px]">سُورَةُ {obj.name}</p>
                    <p className="m-0 font-tajawal text-xs font-bold">
                      <span>أياتها {arNum(obj.verses)}</span>
                      {' - '}
                      <span>{surahType(obj.type)}</span>
                    </p>
                  </div>
                )}

                {obj.localVerse === 1 && ![1, 9].includes(obj.surah) && (
                  <div className="bismillah-text">{START}</div>
                )}

                <span
                  id={'verse_' + obj.globalVerse}
                  className={[getHighlightedVerseColor(obj), 'verse'].filter(Boolean).join(' ')}
                  onClick={(e) => showVerseOpt(obj, e)}
                >
                  <span
                    className="text"
                    dangerouslySetInnerHTML={{ __html: highlight(obj.text, GOD_ARR, 'god') }}
                  />
                  <span className="num">{arNum(obj.localVerse)}</span>
                  {obj.sajda && (
                    <div className="sajda">
                      <span dangerouslySetInnerHTML={{ __html: icons.sajda }} />
                      <span>سجدة</span>
                    </div>
                  )}
                </span>
              </span>
            ))}
          </div>

          {/* page footer */}
          <div className="select-none grid justify-items-center items-center w-full max-w-[500px] mx-auto my-[10px] gap-y-[20px]">
            <div className="font-[Arial,sans-serif] text-[14px] font-bold w-10 h-10 leading-[40px] rounded-full bg-[#f94c66] text-center text-white inline-block m-0 shadow-[0_0_3px_1px_rgba(0,0,0,0.15)] tracking-[1px]">
              {arNum(displayNum)}
            </div>

            <div>
              <label className="page-footer-label w-full block text-xs font-bold text-[#666] font-tajawal mb-[5px] mr-[5px]">القارئ</label>
              <div className="o-select">
                <select value={optionsData.reciter} onChange={e => saveOptionsData('reciter', e.target.value)}>
                  <option value="mahermuaiqly">ماهر المعيقلى</option>
                  <option value="ahmedajamy">احمد العجمى</option>
                  <option value="husary">الحصرى</option>
                </select>
              </div>
            </div>

            <div>
              <label className="page-footer-label w-full block text-xs font-bold text-[#666] font-tajawal mb-[5px] mr-[5px]">التفسير</label>
              <div className="o-select">
                <select value={optionsData.explainer} onChange={e => saveOptionsData('explainer', e.target.value)}>
                  <option value="muyassar">الميسر</option>
                  <option value="jalalayn">الجلالين</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
