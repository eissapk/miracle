'use client';
import { useRef, useLayoutEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import icons from '../../services/icons';
import { normalize } from '../../services/filters';

export default function OptionsRect({ options, onUpdate, onTextCopied, onClose, isAuto, onPlayVerse }) {
  const { setModal, audioRef, readViewRef } = useApp();
  const rectRef = useRef(null);
  const [style, setStyle] = useState({ visibility: 'hidden', top: '0px', left: '0px', position: 'fixed' });

  const isAutoRef = useRef(isAuto);
  isAutoRef.current = isAuto;

  const reciteVerseRef = useRef(null);

  useLayoutEffect(() => {
    if (!rectRef.current) return;
    const { width, height } = rectRef.current.getBoundingClientRect();
    const { top, left, right, width: coordWidth } = options.coords;
    const newTop = top - height - 5;
    const newLeft = coordWidth < width ? right - width : left;
    setStyle({ position: 'fixed', visibility: 'visible', top: newTop + 'px', left: newLeft + 'px' });
  }, [options.coords]);

  const isOffline = () => typeof navigator !== 'undefined' ? !navigator.onLine : true;

  const showNetworkHint = () => {
    if (onUpdate) onUpdate({ networkHint: true, notifyDesc: 'انت غير متصل بالانترنت', notifyClass: 'alert' });
  };

  const deselectVerses = () => {
    document.querySelectorAll('.page .verse').forEach(el => el.classList.remove('selected'));
  };

  const reciteVerse = (obj) => {
    if (isOffline()) return showNetworkHint();
    const audio = audioRef.current;
    if (!audio) return;

    obj = window.verses[obj.globalVerse - 1];
    if (!obj) return;

    if (isAutoRef.current && readViewRef.current && obj.page) {
      readViewRef.current.setPage(obj.page);
    }

    if (!audio.paused) {
      audio.pause();
      if (onUpdate) onUpdate({ isPlaying: false, isInitialPlaying: true });
    }
    audio.src = '';
    deselectVerses();

    const globalVerse = obj.globalVerse;
    audio.src = `https://cdn.islamic.network/quran/audio/64/ar.${options.reciter}/${globalVerse}.mp3`;

    audio.onended = () => {
      if (onUpdate) onUpdate({ isPlaying: false, isInitialPlaying: true });
      deselectVerses();
      if (isAutoRef.current && globalVerse < 6236) {
        reciteVerseRef.current?.({ globalVerse: globalVerse + 1 });
      }
    };

    audio.play().catch(() => {});
    if (onUpdate) onUpdate({ isPlaying: true, isInitialPlaying: true });

    if (onPlayVerse) onPlayVerse(globalVerse);
  };

  reciteVerseRef.current = reciteVerse;

  const getVerseExplanation = (obj) => {
    if (isOffline()) return showNetworkHint();
    const url = `https://api.alquran.cloud/v1/ayah/${obj.surah}:${obj.localVerse}/editions/ar.${options.explainer}`;
    fetch(url)
      .then(r => r.json())
      .then(res => {
        setModal({ name: 'explanation', data: { text: res.data[0].text, explainer: options.explainer } });
      })
      .catch(() => setModal({ name: 'explanation', data: { error: true } }));
  };

  const getVerseTrans = (obj) => {
    if (isOffline()) return showNetworkHint();
    const url = `https://api.alquran.cloud/v1/ayah/${obj.surah}:${obj.localVerse}/en.${options.translator}`;
    fetch(url)
      .then(r => r.json())
      .then(res => {
        setModal({ name: 'trans', data: { text: res.data.text, translator: options.translator } });
      })
      .catch(() => setModal({ name: 'trans', data: { error: true } }));
  };

  const copyText = (obj) => {
    const text = normalize(obj.text);
    navigator.clipboard.writeText(text).catch(() => {});
    if (onTextCopied) onTextCopied();
  };

  const highlightVerse = (obj, e) => {
    const classList = e.target.classList;
    let color = null;
    if (classList.contains('orange')) color = 'orange';
    else if (classList.contains('purple')) color = 'purple';
    else if (classList.contains('blue')) color = 'blue';
    else if (classList.contains('noColor')) color = 'noColor';
    if (!color) return;

    const elm = options.coords.elm;
    if (!elm) return;
    elm.classList.remove('selected', 'orange', 'blue', 'purple', 'noColor', 'red');

    let arr = JSON.parse(localStorage.getItem('highlightedVerses')) || [];

    if (color === 'noColor') {
      arr = arr.filter(item => item.globalVerse !== obj.globalVerse);
      localStorage.setItem('highlightedVerses', JSON.stringify(arr));
      if (onClose) onClose();
      return;
    }

    elm.classList.add(color);
    obj.color = color;

    const existing = arr.find(item => item.globalVerse === obj.globalVerse);
    if (existing) {
      existing.color = color;
    } else {
      arr.push(obj);
    }
    localStorage.setItem('highlightedVerses', JSON.stringify(arr));
    if (onClose) onClose();
  };

  if (!options.obj) return null;

  return (
    <div
      className="OptionsRect fixed top-0 m-auto px-[5px] flex flex-row-reverse w-fit bg-white text-white rounded-[3px] font-bold font-tajawal z-[999] select-none shadow-[1px_1px_3px_1px_rgba(0,0,0,0.1),-1px_-1px_3px_1px_rgba(0,0,0,0.1)]"
      ref={rectRef}
      style={style}
    >
      <div
        className="inline-block relative pr-[5px] mr-[5px] after:absolute after:content-[''] after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-px after:h-[calc(100%-15px)] after:bg-[#e2e2e2]"
        onClick={(e) => highlightVerse(options.obj, e)}
      >
        <button className="orange rounded-full float-right box-border m-[5px_5px_0_0] w-[20px] h-[20px] border-0 outline-0 cursor-pointer bg-[#ff8214] p-[5px]" />
        <button className="purple rounded-full float-right box-border m-[5px_5px_0_0] w-[20px] h-[20px] border-0 outline-0 cursor-pointer bg-[#8b0efe] p-[5px]" />
        <button className="blue rounded-full float-right box-border m-[5px_5px_0_0] w-[20px] h-[20px] border-0 outline-0 cursor-pointer bg-[#0671ff] p-[5px]" />
        <button className="noColor rounded-full float-right box-border m-[5px_5px_0_0] w-[20px] h-[20px] border border-[#ccc] cursor-pointer bg-white p-[5px] relative after:absolute after:content-[''] after:w-[2px] after:h-full after:bg-[#f94c66] after:left-1/2 after:top-1/2 after:rotate-45 after:-translate-x-1/2 after:-translate-y-1/2 after:origin-top-left" />
      </div>
      <div className="inline-block">
        <button
          className="opts-rect-btn w-[20px] h-[20px] border-0 outline-0 m-0 bg-white p-[5px] cursor-pointer box-content block active:[transform:perspective(1px)_translateZ(-0.04px)] active:transition-[200ms_cubic-bezier(0.12,0.8,0.32,1)]"
          onClick={() => getVerseTrans(options.obj)}
          dangerouslySetInnerHTML={{ __html: icons.translate }}
        />
      </div>
      <div className="inline-block">
        <button
          className="opts-rect-btn w-[20px] h-[20px] border-0 outline-0 m-0 bg-white p-[5px] cursor-pointer box-content block active:[transform:perspective(1px)_translateZ(-0.04px)] active:transition-[200ms_cubic-bezier(0.12,0.8,0.32,1)]"
          onClick={() => copyText(options.obj)}
          dangerouslySetInnerHTML={{ __html: icons.clipboard }}
        />
      </div>
      <div className="inline-block">
        <button
          className="opts-rect-btn w-[20px] h-[20px] border-0 outline-0 m-0 bg-white p-[5px] cursor-pointer box-content block active:[transform:perspective(1px)_translateZ(-0.04px)] active:transition-[200ms_cubic-bezier(0.12,0.8,0.32,1)]"
          onClick={() => getVerseExplanation(options.obj)}
          dangerouslySetInnerHTML={{ __html: icons.book }}
        />
      </div>
      <div className="inline-block">
        <button
          className="opts-rect-btn w-[20px] h-[20px] border-0 outline-0 m-0 bg-white p-[5px] cursor-pointer box-content block active:[transform:perspective(1px)_translateZ(-0.04px)] active:transition-[200ms_cubic-bezier(0.12,0.8,0.32,1)]"
          onClick={() => reciteVerse(options.obj)}
          dangerouslySetInnerHTML={{ __html: icons.play }}
        />
      </div>
    </div>
  );
}
