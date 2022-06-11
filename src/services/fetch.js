function handlePages() {

  return new Promise((resolve, reject) => {
    const pages = {};
    fetch("/book.json")
      .then((res) => res.json())
      .then((book) => {
        function recursive(num) {
          const surah = book[num];
          
          surah.ayahs.forEach((obj) => {
            obj.name = surah.name;
            obj.type = surah.type;
            obj.surah = surah.surah;
            obj.verses = surah.verses;
            // bind pages
            if (pages[obj.page]) {
              pages[obj.page].push(obj);
            } else {
              pages[obj.page] = [];
              pages[obj.page].push(obj);
            }
          });
          
          if (num + 1 <= 114) recursive(num + 1);
          else resolve(pages)
        }
        recursive(1);
      })
      .catch(err => {
        console.error(err);
        reject()
      });
  })
}

export default handlePages;