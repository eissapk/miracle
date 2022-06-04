// todo add page number for each object in ref.json
let loader = 0;
let loader_1 = 114;
let loader_2 = 604;
let total = loader_1 + loader_2;

const loaderContainer = document.getElementById("loader");

function sortPages() {
  return new Promise((resolve, reject) => {
    const min = 1;
    const max = 114;
    const pages = {};

    function recursive(num) {
      loaderContainer.style.width = loader + "%";
      // console.log(loader + "%");
      fetch("/assets/surahs/surah_" + num + ".json")
        .then(res => res.json())
        .then(data => {
          const surahName = data.name;
          const surahNum = data.number;
          const totalVerses = data.numberOfAyahs

          const verses = data.ayahs;
          verses.forEach(obj => {
            obj.surahName = surahName;
            obj.surahNum = surahNum;
            obj.totalVerses = totalVerses;
            if (pages[obj.page]) {
              pages[obj.page].push(obj);
            } else {
              pages[obj.page] = [];
              pages[obj.page].push(obj);
            }
          });

          if (num + 1 <= max) {
            loader = Math.ceil((num / total) * 100);
            recursive(num + 1);
          } else {
            resolve(pages);
          }
        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
    }

    recursive(min);
  });
}

function displayPages(pages) {
  return new Promise((resolve, reject) => {
    // console.log(pages);

    for (let page in pages) {
      loaderContainer.style.width = loader + "%";
      // console.log(loader + "%");

      const currentPageArr = pages[page];

      const content = currentPageArr
        .map(obj => {
          const verseNum = String(obj.numberInSurah);
          const verseText = highlight(obj.text, godArr);
          const surahName = `
          <div class="surahInfo o-grid">
          <span class="order col=3:4 row=1:2"> ترتيبها ${String(obj.surahNum).toArNum()}</span>
          <span class="name col=2:3 row=1:2">${obj.surahName}</span>
          <span class="total col=1:2 row=1:2"> اياتها ${String(obj.totalVerses).toArNum()}</span>
          </div>`;
          if (verseNum == 1) {
            if ([1, 9].includes(obj.surahNum)) { // الفاتحة و التوبة
              return `${surahName}<span class="verse" data-pos="${obj.surahNum}-${verseNum}">${verseText.trim()}<span class="num">${verseNum.toArNum()}</span></span>`;
            } else {
              return `${surahName}<h3 class="start">${highlight(start, godArr)}</h3><span class="verse" data-pos="${obj.surahNum}-${verseNum}">${verseText.trim()}<span class="num">${verseNum.toArNum()}</span></span>`;
            }
          }
          return `<span class="verse" data-pos="${obj.surahNum}-${verseNum}">${verseText.trim()}<span class="num">${verseNum.toArNum()}</span></span>`;
        })
        .join("");

      const div = document.createElement("div");
      div.id = "page_" + page;
      div.className = "page hide";
      div.setAttribute("data-page", String(page).toArNum())
      // todo add 30 parts hint
      // todo surah name if page doesn't have the start
      // e.g  surah name - part

      div.innerHTML = content;
      const wrapper = document.querySelector("main");
      wrapper.append(div);

      // loader
      loader = Math.ceil(((loader_1 + Number(page) ) / total) * 100);
      if (loader === 100) setTimeout(() => loaderContainer.classList.add("hide"), 100);
    }

    resolve();
  });
}

async function init() {
  const pages = await sortPages();
  const display = await displayPages(pages);
  console.log("loaded book");
}

init();

function page(num) {
  const pages = document.querySelectorAll(".page");
  pages.forEach(page => page.classList.add("hide"));
  const targetPage = document.getElementById("page_" + num);
  if (targetPage) {
    targetPage.classList.remove("hide");
  }
}

document.body.onclick = function (e) {
  if (e.target.classList.contains("verse")) {
    console.log(e.target.firstChild, e.target.getAttribute("data-pos"));
  }
};