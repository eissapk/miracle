import book from './book';

function handlePages() {
  return new Promise((resolve, reject) => {
    const pages = {};
    const surahs = [];
    const verses = [];

    function recursive(num) {
      const surah = book[num];
      surahs.push({
        ayahs: surah.ayahs.map(item => ({ page: item.page, localVerse: item.localVerse, globalVerse: item.globalVerse })),
        juz: surah.ayahs[0].juz,
        page: surah.ayahs[0].page,
        name: surah.name,
        surah: surah.surah,
        type: surah.type,
        verses: surah.verses,
      });
      surah.ayahs.forEach(obj => {
        obj.name = surah.name;
        obj.type = surah.type;
        obj.surah = surah.surah;
        obj.verses = surah.verses;
        if (pages[obj.page]) {
          pages[obj.page].push(obj);
        } else {
          pages[obj.page] = [obj];
        }
      });

      if (num + 1 <= 114) {
        recursive(num + 1);
      } else {
        function recursive2(num2) {
          pages[num2].forEach(item => verses.push(item));
          if (num2 + 1 <= 604) recursive2(num2 + 1);
          else resolve({ pages, verses, surahs });
        }
        recursive2(1);
      }
    }
    recursive(1);
  });
}

export default handlePages;
