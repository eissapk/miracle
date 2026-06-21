"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";
import icons from "../services/icons";
import { normalize, arNum, getFirstPage } from "../services/filters";

export default function SearchEngine({ onHideModal }) {
  const router = useRouter();
  const { setModal, readViewEnabled, setCurrentVerse, setHighlightCurrentVerse, readViewRef } = useApp();
  const [tabs, setTabs] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("tabs")) || getDefaultTabs();
    }
    return getDefaultTabs();
  });
  const [tab, setTab] = useState("verse");
  const [input, setInput] = useState("");
  const [settingsShown, setSettingsShown] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [results, setResults] = useState([]);
  const [resultsHint, setResultsHint] = useState("");
  const [length, setLength] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [resultsCounter, setResultsCounter] = useState(1);
  const tabPlaceholders = {
    verse: "ابحث عن آية...",
    surah: "ابحث عن سورة...",
    page: "رقم الصفحة (1-604)",
    part: "رقم الجزء (1-30)",
  };

  const scrollLimit = 30;
  const engineRef = useRef(null);
  const ulRef = useRef(null);

  useEffect(() => {
    setCurrentVerse(null);
    if (engineRef.current) engineRef.current.focus();
  }, []);

  function getDefaultTabs() {
    return [
      { text: "أية", tab: "verse", checked: true },
      { text: "سورة", tab: "surah", checked: true },
      { text: "صفحة", tab: "page", checked: false },
      { text: "جزء", tab: "part", checked: false },
      { text: "عرض تلقائى للنتائج", checked: false, id: "infiniteScroll" },
    ];
  }

  const searchForVerse = (str, limit = 30) => {
    str = str.replace(/ى/g, "ي").replace(/ٱ|آ|إ|أ/g, "ا");
    if (!window.verses) return { length: 0, results: [] };
    const all = window.verses.filter((obj) => normalize(obj.text).trim().includes(str));
    return { length: all.length, results: all.slice(0, limit) };
  };

  const searchForSurah = (str, limit = 30) => {
    str = str.replace(/ى/g, "ي").replace(/ٱ|آ|إ|أ/g, "ا");
    if (!window.surahs) return { length: 0, results: [] };
    const all = window.surahs.filter((obj) => normalize(obj.name).trim().includes(str));
    return { length: all.length, results: all.slice(0, limit) };
  };

  const reset = () => {
    setResultsCounter(1);
    setHasMore(false);
    if (ulRef.current) ulRef.current.scrollTo(0, 0);
  };

  const navigateTo = (page, globalVerse = null) => {
    if (onHideModal) onHideModal();
    if (globalVerse !== null) {
      setCurrentVerse(globalVerse);
      setHighlightCurrentVerse(true);
    } else {
      setCurrentVerse(null);
      setHighlightCurrentVerse(false);
    }
    if (readViewEnabled && readViewRef.current) {
      readViewRef.current.setPage(+page);
    } else {
      router.push("/read/" + page);
    }
  };

  const search = (e) => {
    if (input === "" || e.keyCode !== 13) return;
    if (tab === "verse") {
      reset();
      const obj = searchForVerse(input, scrollLimit + 1);
      if (obj.length) {
        setResults(obj.results);
        setHasResults(true);
        setHasMore(obj.results.length === scrollLimit + 1);
      } else {
        setHasResults(false);
        setResultsHint("لايوجد نتائج");
        setHasMore(false);
      }
      setLength(obj.length);
      if (engineRef.current) engineRef.current.blur();
    } else if (tab === "surah") {
      reset();
      const obj = searchForSurah(input, scrollLimit + 1);
      if (obj.length) {
        setResults(obj.results);
        setHasResults(true);
        setHasMore(obj.results.length === scrollLimit + 1);
      } else {
        setHasResults(false);
        setResultsHint("لايوجد نتائج");
        setHasMore(false);
      }
      setLength(obj.length);
      if (engineRef.current) engineRef.current.blur();
    } else if (tab === "page") {
      const num = +input;
      if (isNaN(num) || num < 1 || num > 604) {
        setHasResults(false);
        setResultsHint(arNum("ادخل رقم بين 1 و 604"));
        return;
      }
      setResultsHint("");
      navigateTo(num);
    } else if (tab === "part") {
      let num = +input;
      if (isNaN(num) || num < 1 || num > 30) {
        setHasResults(false);
        setResultsHint(arNum("ادخل رقم بين 1 و 30"));
        return;
      }
      navigateTo(getFirstPage(num));
    }
  };

  const handleScroll = (e) => {
    const elm = e.target;
    const reachedEnd = elm.scrollTop >= elm.scrollHeight - elm.offsetHeight;
    const infiniteScroll = tabs.find((item) => item.id === "infiniteScroll");
    if (!infiniteScroll?.checked || !reachedEnd) return;
    if (tab === "verse" && hasMore && results.length !== length) {
      const next = resultsCounter + 1;
      setResultsCounter(next);
      const obj = searchForVerse(input, scrollLimit * next + 1);
      setResults(obj.results);
    } else if (tab === "surah" && hasMore && results.length !== length) {
      const next = resultsCounter + 1;
      setResultsCounter(next);
      const obj = searchForSurah(input, scrollLimit * next + 1);
      setResults(obj.results);
    }
  };

  const handleSelectedTabs = (item) => {
    setTab(item.tab);
    setResults([]);
    setLength(0);
    setResultsHint("");
    setResultsCounter(1);
    setHasMore(false);
    if (engineRef.current) engineRef.current.focus();
  };

  const handleCheckedTabs = (item) => {
    const updated = tabs.map((t) => (t === item ? { ...t, checked: !t.checked } : t));
    setTabs(updated);
    localStorage.setItem("tabs", JSON.stringify(updated));
  };

  const goTo = (e) => {
    if (e.target.nodeName !== "LI") return;
    const verseAttr = e.target.getAttribute("data-verse");
    const surahAttr = e.target.getAttribute("data-surah");
    if (verseAttr) {
      const [page, globalVerse] = verseAttr.split("-");
      navigateTo(page, globalVerse);
    } else if (surahAttr) {
      const select = e.target.querySelector("select");
      if (select) {
        const [page, verse] = select.selectedOptions[0].value.split("-");
        navigateTo(page, verse);
      }
    }
  };

  return (
    <div className="p-[2px]">
      <div className="w-full">
        <div className="o-search !w-full before:right-[10px] before:left-auto">
          <input
            type="text"
            className="o-input h-[40px] px-[30px] pl-[25px] w-full"
            value={input}
            placeholder={tabPlaceholders[tab] || ""}
            onChange={(e) => setInput(e.target.value)}
            ref={engineRef}
            onKeyUp={search}
            onKeyPress={search}
            required
          />
          <button
            className="o-close !h-full !right-auto !left-0 !top-0 !bg-[position:3px_11px] [transform:rotate(180deg)]"
            onClick={() => setInput("")}
          />
        </div>
      </div>

      <div className="search-inner w-full min-h-[70px] mt-[5px] rounded-[3px] border border-[#e8dcc8]">
        <nav className="px-[10px] pl-[35px] pb-[5px] pt-[10px] border-b border-[#e8dcc8] relative bg-[#fdf8f0]">
          <ul className="m-0 p-0 pb-[5px] pl-[5px] list-none flex whitespace-nowrap overflow-auto scrollbar">
            {tabs.map(
              (item, index) =>
                item.tab && (
                  <li
                    key={index}
                    className={[
                      "hidden cursor-pointer px-[10px] pt-[5px] pb-[2.5px] rounded-[50px] ml-[10px] border border-[#eee] select-none last:ml-0",
                      item.tab === tab ? "bg-gradient-to-r from-[#c8952a] to-[#e8b85a] border-[#c8952a] [&>a]:text-[#1a0f00] [&>a]:font-bold" : "",
                      item.checked ? "!inline-block" : "",
                    ].join(" ")}
                    onClick={() => handleSelectedTabs(item)}
                  >
                    <a className="pointer-events-none no-underline text-center block text-[14px] text-[#666] font-tajawal">{item.text}</a>
                  </li>
                )
            )}
          </ul>
          <button
            style={length ? { top: "23px" } : {}}
            className="w-[25px] h-[25px] bg-transparent border-0 outline-none p-0 absolute left-[10px] cursor-pointer top-1/2 -translate-y-1/2 hover:[&>svg]:text-[#c8952a] active:[-translate-y-1/2_perspective(1px)_translateZ(-0.04px)] [&>svg]:w-full [&>svg]:h-full [&>svg]:text-[#666]"
            dangerouslySetInnerHTML={{ __html: icons.settings }}
            onClick={() => setSettingsShown((s) => !s)}
          />
          {length > 0 && <div className="text-xs text-[#666] font-tajawal tracking-[1px] mt-[5px] font-bold">{arNum(length)} نتيجة</div>}
        </nav>

        {!settingsShown && hasResults && (
          <div>
            <ul className="m-0 p-[10px] list-none overflow-auto h-[calc(100vh-255px)] scrollbar" onClick={goTo} onScroll={handleScroll} ref={ulRef}>
              {tab === "verse" &&
                results.map((item, index) => (
                  <li
                    key={index}
                    className="search-result-item border-b border-[#eee] py-[10px] rounded-[3px] cursor-pointer overflow-hidden first:pt-0 last:border-0 last:pb-0 hover:[&>a]:text-[#647eff]"
                    data-verse={`${item.page}-${item.globalVerse}`}
                  >
                    <div className="verseInfo pointer-events-none">
                      <span className="verseInfo__name text-xs font-bold text-[#666] font-kitab float-left">{item.name}</span>
                      <span className="verseInfo__page text-xs font-bold text-[#666] font-kitab float-right ml-[10px]">صفحة {arNum(item.page)}</span>
                    </div>
                    <a className="block font-kitab text-[20px] font-bold text-[#666] no-underline px-[5px] py-[10px] rounded-[3px] transition-[background_0.1s_ease] select-none pointer-events-none">
                      {item.text}
                      <span className="pointer-events-none font-[Arial,sans-serif] w-[35px] h-[35px] leading-[35px] rounded-full inline-block text-[15px] text-center mx-[8px] select-none bg-gradient-to-br from-[#c8952a] to-[#e8b85a] text-[#1a0f00] shadow-[0_0_3px_1px_rgba(0,0,0,0.15)]">
                        {arNum(item.localVerse)}
                      </span>
                    </a>
                  </li>
                ))}
              {tab === "surah" &&
                results.map((item, index) => (
                  <li
                    key={index}
                    className="search-result-item border-b border-[#eee] py-[10px] overflow-hidden first:pt-0 last:border-0 last:pb-0 flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="font-kitab text-[20px] font-bold text-[#444] block truncate">سُورَةُ {item.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-tajawal text-[12px] text-[#888]">آية</span>
                      <div className="o-select inline-block min-w-[55px]">
                        <select defaultValue={`${item.ayahs[0].page}-${item.ayahs[0].globalVerse}`}>
                          {item.ayahs.map((ayah, i) => (
                            <option key={i} value={`${ayah.page}-${ayah.globalVerse}`}>
                              {arNum(ayah.localVerse)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        className="h-[34px] px-[14px] rounded-full border-0 outline-none cursor-pointer text-[13px] font-bold font-tajawal whitespace-nowrap transition-transform active:scale-95"
                        style={{ background: "linear-gradient(135deg,#c8952a,#e8b85a)", color: "#1a0f00", boxShadow: "0 2px 8px rgba(212,168,67,0.3)" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const select = e.currentTarget.closest("li").querySelector("select");
                          if (select) {
                            const [page, verse] = select.selectedOptions[0].value.split("-");
                            navigateTo(page, verse);
                          }
                        }}
                      >
                        اذهب
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {!settingsShown && !hasResults && (
          <div className="search-no-results text-center p-[10px] text-[#666] text-[14px] tracking-normal select-none">{resultsHint}</div>
        )}

        {settingsShown && (
          <div className="select-none">
            <div className="p-0 px-[10px]">
              {tabs.map(
                (item, index) =>
                  (!item.tab || (item.tab !== "surah" && item.tab !== "verse")) && (
                    <label
                      key={index}
                      className="search-settings-label flex w-full mb-[5px] border-b border-[#e8dcc8] py-[10px] text-[#5a4030] text-[14px] font-bold last:border-b-0 last:mb-0 items-center justify-between"
                    >
                      {item.text}
                      <input type="checkbox" className="o-switch-btn" checked={item.checked} onChange={() => handleCheckedTabs(item)} />
                    </label>
                  )
              )}
            </div>
            <div className="search-settings-footer bg-[#f0e4c8] p-[10px]">
              <button className="o-btn font-tajawal leading-[35px] font-bold px-[20px]" onClick={() => setSettingsShown(false)}>
                الغاء
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
