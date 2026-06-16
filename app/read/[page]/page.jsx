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

const MOON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd"/></svg>`;
const SUN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/></svg>`;

const optBtnBase = 'opt-btn float-right w-10 h-10 bg-gradient-to-r from-[#c8952a] to-[#e8b85a] mx-[5px] rounded-full border-0 outline-none cursor-pointer active:[transform:perspective(1px)_translateZ(-0.04px)] active:transition-[200ms_cubic-bezier(0.12,0.8,0.32,1)]';

/* Non-interactive preview shown in left/right slider slots */
function SidePageView({ pageData, isDark }) {
  if (!pageData) return null;
  const textColor = isDark ? 'rgba(250,235,200,0.75)' : '#2a1a00';
  return (
    <div className="h-full px-4 pt-4 pb-4 overflow-hidden select-none pointer-events-none" dir="rtl">
      {pageData.map((obj, i) => (
        <span key={i}>
          {obj.localVerse === 1 && (
            <div className="text-center my-4">
              <span className="inline-block text-[#1a0f00] text-[11px] font-bold rounded-full px-3 py-1"
                style={{ background: 'linear-gradient(to left,#c8952a,#e8b85a)' }}>
                سُورَةُ {obj.name}
              </span>
            </div>
          )}
          {obj.localVerse === 1 && ![1, 9].includes(obj.surah) && (
            <div className="text-center text-[12px] mb-2 font-almushaf"
              style={{ background: 'linear-gradient(to left,#c8952a,#f0c060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {START}
            </div>
          )}
          <span className="font-kitab text-[25px] leading-[2.1]" style={{ color: textColor }}>{obj.text}</span>
          <span className="inline-flex items-center justify-center w-[35px] h-[35px] rounded-full text-[#1a0f00] text-[15px] mx-[8px] align-middle"
            style={{ background: 'linear-gradient(135deg,#c8952a,#e8b85a)', fontFamily: 'Arial,sans-serif' }}>
            {arNum(obj.localVerse)}
          </span>
        </span>
      ))}
    </div>
  );
}

export default function ReadPage() {
  const { page: pageParam } = useParams();
  const router = useRouter();
  const { setModal, setReadViewEnabled, audioRef, readViewRef, currentVerse, highlightCurrentVerse, setHighlightCurrentVerse, isDark, toggleDark } = useApp();

  const pageNum = useRef(+pageParam);
  const [currentPage, setCurrentPage] = useState(null);
  const [sliderPages, setSliderPages] = useState([null, null, null]); // [next, current, prev]
  const [isLoading, setIsLoading] = useState(true);
  const [hasSajda, setHasSajda] = useState(false);
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

  const containerRef = useRef(null);   // overflow-hidden slider viewport
  const trackRef = useRef(null);       // 3-card flex strip
  const pageScrollRef = useRef(null);  // scrollable inner div of center card
  const barRef = useRef(null);
  const intervalRef = useRef(null);
  const notifyTimerRef = useRef(null);
  const scrollUpdateCleanupRef = useRef(null);
  const isAnimatingRef = useRef(false);

  const getLastReadObj = (arr) => {
    const f = arr[0];
    return { juz: f.juz, page: f.page, name: f.name, type: f.type, surah: f.surah, verses: f.verses };
  };

  const getSurahName = useCallback((page) => {
    if (!page || !page.length) return '';
    const firstLens = page.filter(o => o.surah === page[0].surah).map(o => o.text.length);
    const secondLens = page.filter(o => o.surah !== page[0].surah).map(o => o.text.length);
    const maxFirst = firstLens.length ? Math.max(...firstLens) : 0;
    const maxSecond = secondLens.length ? Math.max(...secondLens) : 0;
    return maxFirst >= maxSecond ? page[0].name : page[page.length - 1].name;
  }, []);

  const resetTrack = useCallback(() => {
    if (!trackRef.current || !containerRef.current) return;
    const w = containerRef.current.offsetWidth;
    trackRef.current.style.transition = 'none';
    trackRef.current.style.transform = `translateX(${-w}px)`;
  }, []);

  const loadSliderPages = useCallback((num) => {
    const curr = window.pages?.[num] || null;
    const nxt  = window.pages?.[num + 1] || null;
    const prv  = window.pages?.[num - 1] || null;
    setSliderPages([nxt, curr, prv]);
    setCurrentPage(curr);
    if (curr) {
      setHasSajda(!!curr.find(item => item.sajda));
      localStorage.setItem('lastRead', JSON.stringify(getLastReadObj(curr)));
      setIsLoading(false);
    }
    if (pageScrollRef.current) pageScrollRef.current.scrollTop = 0;
    // Reset track after React flushes
    setTimeout(resetTrack, 0);
  }, [resetTrack]);

  useEffect(() => {
    const num = pageNum.current;
    if (isNaN(num) || num < 1 || num > 604) { setIsLoading(true); return; }

    const saved = JSON.parse(localStorage.getItem('optionsData')) || defaultOptions;
    const savedAuto = JSON.parse(localStorage.getItem('autoReciting')) || false;
    setIsAuto(savedAuto);
    setOptionsData(prev => ({ ...prev, reciter: saved.reciter, explainer: saved.explainer, translator: saved.translator }));

    if (window.pages) {
      loadSliderPages(num);
    } else {
      setIsLoading(true);
      intervalRef.current = setInterval(() => {
        if (window.pages) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          loadSliderPages(num);
        }
      }, 1);
      setTimeout(() => {
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      }, 5000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [loadSliderPages]);

  /* Animated navigation used by swipe */
  const goToPage = useCallback((num, direction) => {
    if (isAnimatingRef.current) return;
    if (num < 1 || num > 604) return;
    isAnimatingRef.current = true;
    const w = containerRef.current?.offsetWidth || 0;
    const targetX = direction === 'next' ? 0 : -2 * w;
    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 0.32s ease';
      trackRef.current.style.transform = `translateX(${targetX}px)`;
    }
    setTimeout(() => {
      pageNum.current = num;
      setDisplayNum(num);
      window.history.replaceState(null, '', '/read/' + num);
      setOptionsRectShown(false);
      loadSliderPages(num);
      isAnimatingRef.current = false;
    }, 320);
  }, [loadSliderPages]);

  /* Button / keyboard navigation — instant, no animation */
  const next = useCallback(() => {
    const num = Math.min(pageNum.current + 1, 604);
    if (num === pageNum.current) return;
    pageNum.current = num;
    setDisplayNum(num);
    window.history.replaceState(null, '', '/read/' + num);
    setOptionsRectShown(false);
    loadSliderPages(num);
  }, [loadSliderPages]);

  const prev = useCallback(() => {
    const num = Math.max(pageNum.current - 1, 1);
    if (num === pageNum.current) return;
    pageNum.current = num;
    setDisplayNum(num);
    window.history.replaceState(null, '', '/read/' + num);
    setOptionsRectShown(false);
    loadSliderPages(num);
  }, [loadSliderPages]);

  useEffect(() => {
    setReadViewEnabled(true);
    readViewRef.current = {
      setPage: (num) => {
        pageNum.current = num;
        setDisplayNum(num);
        window.history.replaceState(null, '', '/read/' + num);
        setOptionsRectShown(false);
        loadSliderPages(num);
      },
    };
    return () => { setReadViewEnabled(false); readViewRef.current = null; };
  }, [setReadViewEnabled, readViewRef, loadSliderPages]);

  useEffect(() => {
    if (!currentPage) return;
    const handleKey = (e) => {
      if (e.keyCode === 39) next();
      else if (e.keyCode === 37) prev();
    };
    document.body.addEventListener('keydown', handleKey);
    return () => document.body.removeEventListener('keydown', handleKey);
  }, [currentPage, next, prev]);

  /* Slider touch — horizontal drag reveals adjacent pages */
  useEffect(() => {
    if (!currentPage || !containerRef.current || !trackRef.current) return;
    const container = containerRef.current;
    const track = trackRef.current;
    let startX = 0, startY = 0, isDragging = false, isVertical = false, decidedAxis = false;

    const onTouchStart = (e) => {
      if (isAnimatingRef.current) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
      isVertical = false;
      decidedAxis = false;
      track.style.transition = 'none';
      const w = container.offsetWidth;
      track.style.transform = `translateX(${-w}px)`;
    };

    const onTouchMove = (e) => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (!decidedAxis && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
        decidedAxis = true;
        isVertical = Math.abs(dy) > Math.abs(dx);
      }
      if (!decidedAxis || isVertical) return;
      e.preventDefault();
      const w = container.offsetWidth;
      const n = pageNum.current;
      const atEdge = (dx > 0 && n >= 604) || (dx < 0 && n <= 1);
      track.style.transform = `translateX(${-w + (atEdge ? dx * 0.12 : dx)}px)`;
    };

    const onTouchEnd = (e) => {
      if (!isDragging) return;
      isDragging = false;
      if (isVertical || !decidedAxis) return;
      const dx = e.changedTouches[0].clientX - startX;
      const w = container.offsetWidth;
      const n = pageNum.current;
      if (dx > w * 0.28 && n < 604) {
        goToPage(n + 1, 'next');
      } else if (dx < -(w * 0.28) && n > 1) {
        goToPage(n - 1, 'prev');
      } else {
        track.style.transition = 'transform 0.28s ease';
        track.style.transform = `translateX(${-w}px)`;
      }
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd);
    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [currentPage, goToPage]);

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
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' }); el.classList.add('selected'); }
  }, [playingVerse, currentPage]);

  useEffect(() => {
    if (!highlightCurrentVerse || !currentVerse) return;
    const el = document.getElementById('verse_' + currentVerse);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      el.classList.add('red');
      setTimeout(() => { el.classList.remove('red'); setHighlightCurrentVerse(false); }, 3000);
    }
  }, [highlightCurrentVerse, currentVerse, currentPage]);

  const showNotify = useCallback((desc, cls = '', duration = 1000) => {
    if (notifyTimerRef.current) clearTimeout(notifyTimerRef.current);
    setNotifyDesc(desc); setNotifyClass(cls); setNotifyShown(true);
    notifyTimerRef.current = setTimeout(() => {
      setNotifyShown(false); setNotifyDesc(''); setNotifyClass(''); setIsBookmarkDisabled(false);
    }, duration);
  }, []);

  const getHighlightedVerseColor = (obj) => {
    const arr = JSON.parse(localStorage.getItem('highlightedVerses')) || [];
    const found = arr.find(item => item.globalVerse === obj.globalVerse);
    return found ? found.color : null;
  };

  const showVerseOpt = (obj, e) => {
    const verseElm = e.currentTarget;
    document.querySelectorAll('.page .verse').forEach(v => v.classList.remove('selected'));
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
      juz: currentPage[0].juz, page: currentPage[0].page,
      name: getSurahName(currentPage), type: currentPage[0].type,
      surah: currentPage[0].surah, verses: currentPage[0].verses,
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
    if (update.networkHint) { showNotify(update.notifyDesc || 'انت غير متصل بالانترنت', update.notifyClass || 'alert', 2000); return; }
    if (update.isPlaying !== undefined) setIsPlaying(update.isPlaying);
    if (update.isInitialPlaying !== undefined) setIsInitialPlaying(update.isInitialPlaying);
  }, [showNotify]);

  const handleTextCopied = () => showNotify('تم النسخ');
  const handleHighlightChanged = () => { setOptionsRectShown(false); setHighlightTick(t => t + 1); };

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
  const cardBg = { background: isDark ? '#0c0900' : '#fdf8f0' };

  return (
    <div className="h-screen flex flex-col overflow-hidden font-tajawal" style={{ background: isDark ? '#050505' : '#fdfaf5' }}>
      {notifyShown && <div className={`NotifyModal ${notifyClass}`}>{notifyDesc}</div>}

      {optionsRectShown && (
        <OptionsRect
          options={optionsData} isAuto={isAuto}
          onUpdate={handlePlayingUpdate} onTextCopied={handleTextCopied}
          onClose={handleHighlightChanged} onPlayVerse={setPlayingVerse}
        />
      )}

      <div className="flex-1 flex justify-center px-3 pt-5 pb-5 overflow-hidden">
        <div className="w-full max-w-[560px] flex flex-col gap-4">

          {/* slider viewport */}
          <div
            ref={containerRef}
            className="flex-1 rounded-3xl overflow-hidden"
            style={{
              border: `1px solid ${isDark ? 'rgba(212,168,67,0.15)' : 'rgba(180,130,40,0.2)'}`,
              boxShadow: isDark ? '0 8px 40px rgba(0,0,0,0.5)' : '0 8px 40px rgba(180,130,40,0.1)',
            }}
          >
            {/* 3-card track: [next | current | prev]
                translateX(-33.333%) = -1 card width, centers on middle card */}
            <div
              ref={trackRef}
              className="h-full"
              style={{ display: 'flex', width: '300%', willChange: 'transform', transform: 'translateX(-33.333%)' }}
            >
              {/* left slot → next page (revealed on swipe-right) */}
              <div className="h-full" style={{ width: '33.333%', flex: '0 0 33.333%', ...cardBg }}>
                <SidePageView pageData={sliderPages[0]} isDark={isDark} />
              </div>

              {/* center slot → current page */}
              <div className="h-full" style={{ width: '33.333%', flex: '0 0 33.333%', ...cardBg }}>
                <div ref={pageScrollRef} className="page h-full px-4 pt-4 pb-4 overflow-y-auto scrollbar">

                  {/* bar */}
                  <div className="select-none overflow-hidden py-[5px] mb-[20px] relative" ref={barRef}>
                    <span className="bar-label text-[15px] font-bold text-[#8b5e00] dark:text-[#d4a843] leading-[35px] border-b-2 border-[#c8952a] float-left font-kitab">
                      {surahName}
                    </span>
                    <div
                      className="font-bold w-10 h-10 leading-[40px] rounded-full bg-gradient-to-br from-[#c8952a] to-[#e8b85a] text-center text-[#1a0f00] shadow-md m-auto absolute left-1/2 -translate-x-1/2 tracking-[1px]"
                      style={{ fontFamily: 'Arial,sans-serif', fontSize: '14px' }}
                    >
                      {arNum(displayNum)}
                    </div>
                    <span className="bar-label text-xs font-bold text-[#8b5e00] dark:text-[#d4a843] leading-[35px] border-b-2 border-[#c8952a] float-right tracking-[1px]">
                      {juz(currentPage[0].juz)}
                    </span>
                  </div>

                  {/* options toolbar */}
                  <div className="overflow-hidden mb-[5px] py-[5px]">
                    <button className={optBtnBase} dangerouslySetInnerHTML={{ __html: icons.home }} onClick={() => router.push('/')} />
                    <button className={optBtnBase} dangerouslySetInnerHTML={{ __html: icons.search }} onClick={() => setModal({ name: 'search', data: null })} />
                    <button
                      disabled={isBookmarkDisabled}
                      className={`${optBtnBase}${isBookmarkDisabled ? ' disabled' : ''}`}
                      dangerouslySetInnerHTML={{ __html: icons.bookmark }}
                      onClick={bookmarkPage}
                    />
                    <button className={optBtnBase} dangerouslySetInnerHTML={{ __html: isDark ? SUN : MOON }} onClick={toggleDark} />
                    {isInitialPlaying && (
                      isPlaying
                        ? <button className={optBtnBase} dangerouslySetInnerHTML={{ __html: icons.pause }} onClick={pauseReciting} />
                        : <button className={optBtnBase} dangerouslySetInnerHTML={{ __html: icons.playSolid }} onClick={resumeReciting} />
                    )}
                    {isInitialPlaying && (
                      <label className="auto-label inline-block h-10 leading-[45px] font-tajawal text-xs font-bold text-[#8b5e00] dark:text-[#d4a843] select-none">
                        <input type="checkbox" className="o-switch-btn scale-[1.3] mx-[10px] ml-[15px] mt-[10px] float-right" checked={isAuto} onChange={handleAutoChange} />
                        تلقائي
                      </label>
                    )}
                  </div>

                  {/* page content */}
                  <div className={`page-content relative${hasSajda ? ' has-sajda' : ''}`}>
                    {currentPage.map((obj, index) => (
                      <span key={index}>
                        {obj.localVerse === 1 && (
                          <div className="page-head text-[#1a0f00] bg-gradient-to-r from-[#c8952a] to-[#e8b85a] text-[18px] text-center mb-[10px] rounded-[50px] py-[20px] select-none max-w-[200px] mx-auto my-[20px] shadow-md shadow-amber-900/30">
                            <p className="font-bold w-[30px] h-[30px] leading-[30px] rounded-full mx-auto mb-[10px] bg-white text-[#1a0f00] text-xs m-0" style={{ fontFamily: 'Arial,sans-serif' }}>
                              {arNum(obj.surah)}
                            </p>
                            <p className="font-bold text-[20px] font-kitab m-0 mb-[5px]">سُورَةُ {obj.name}</p>
                            <p className="m-0 font-tajawal text-xs font-bold">
                              <span>أياتها {arNum(obj.verses)}</span>{' - '}<span>{surahType(obj.type)}</span>
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
                          <span className="text" dangerouslySetInnerHTML={{ __html: highlight(obj.text, GOD_ARR, 'god') }} />
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
                    <div className="font-bold w-10 h-10 leading-[40px] rounded-full bg-gradient-to-br from-[#c8952a] to-[#e8b85a] text-center text-[#1a0f00] inline-block m-0 shadow-md tracking-[1px]"
                      style={{ fontFamily: 'Arial,sans-serif', fontSize: '14px' }}>
                      {arNum(displayNum)}
                    </div>
                    <div>
                      <label className="page-footer-label w-full block text-xs font-bold text-[#8b5e00] dark:text-[#d4a843] font-tajawal mb-[5px] mr-[5px]">القارئ</label>
                      <div className="o-select">
                        <select value={optionsData.reciter} onChange={e => saveOptionsData('reciter', e.target.value)}>
                          <option value="mahermuaiqly">ماهر المعيقلى</option>
                          <option value="ahmedajamy">احمد العجمى</option>
                          <option value="husary">الحصرى</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="page-footer-label w-full block text-xs font-bold text-[#8b5e00] dark:text-[#d4a843] font-tajawal mb-[5px] mr-[5px]">التفسير</label>
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

              {/* right slot → prev page (revealed on swipe-left) */}
              <div className="h-full" style={{ width: '33.333%', flex: '0 0 33.333%', ...cardBg }}>
                <SidePageView pageData={sliderPages[2]} isDark={isDark} />
              </div>
            </div>
          </div>

          {/* bottom navigation */}
          <div className="flex items-center justify-between px-1 shrink-0">
            <button
              className="nav-btn w-12 h-12 rounded-full border-0 outline-none cursor-pointer transition-all disabled:opacity-25 active:[transform:perspective(1px)_translateZ(-0.04px)] active:transition-[200ms_cubic-bezier(0.12,0.8,0.32,1)]"
              style={{ background: 'linear-gradient(135deg,#c8952a,#e8b85a)', boxShadow: '0 4px 16px rgba(212,168,67,0.25)' }}
              dangerouslySetInnerHTML={{ __html: icons.next }}
              onClick={next} disabled={displayNum >= 604}
            />
            <span className="text-sm font-bold tabular-nums" style={{ color: isDark ? 'rgba(212,168,67,0.6)' : 'rgba(120,80,10,0.55)', fontFamily: 'Arial,sans-serif' }}>
              {arNum(displayNum)} / 604
            </span>
            <button
              className="nav-btn w-12 h-12 rounded-full border-0 outline-none cursor-pointer transition-all disabled:opacity-25 active:[transform:perspective(1px)_translateZ(-0.04px)] active:transition-[200ms_cubic-bezier(0.12,0.8,0.32,1)]"
              style={{ background: 'linear-gradient(135deg,#c8952a,#e8b85a)', boxShadow: '0 4px 16px rgba(212,168,67,0.25)' }}
              dangerouslySetInnerHTML={{ __html: icons.prev }}
              onClick={prev} disabled={displayNum <= 1}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
