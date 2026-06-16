'use client';
import { createContext, useContext, useState, useRef, useEffect } from 'react';
import handlePages from '../services/fetch';
import popup from '../services/popup';
import book from '../services/book';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [modal, setModal] = useState({ name: '', data: null });
  const [isLoading, setIsLoading] = useState(true);
  const [readViewEnabled, setReadViewEnabled] = useState(false);
  const [currentVerse, setCurrentVerse] = useState(null);
  const [highlightCurrentVerse, setHighlightCurrentVerse] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const audioRef = useRef(null);
  const readViewRef = useRef(null);

  useEffect(() => {
    const savedDark = JSON.parse(localStorage.getItem('isDark'));
    if (savedDark) {
      setIsDark(true);
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
    }

    audioRef.current = new Audio();
    window.book = book;
    window.oConfirm = popup.oConfirm;
    window.oAlert = popup.oAlert;

    handlePages()
      .then(({ pages, verses, surahs }) => {
        window.pages = pages;
        window.surahs = surahs;
        window.verses = verses;
        document.body.classList.remove('overflow');
        setIsLoading(false);
      })
      .catch(console.error);
  }, []);

  const toggleDark = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('isDark', JSON.stringify(newDark));
    if (newDark) {
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <AppContext.Provider value={{
      modal, setModal,
      isLoading,
      readViewEnabled, setReadViewEnabled,
      currentVerse, setCurrentVerse,
      highlightCurrentVerse, setHighlightCurrentVerse,
      audioRef,
      readViewRef,
      isDark, toggleDark,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
