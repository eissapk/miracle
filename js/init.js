// const surahs = []
function sortPages() {
  return new Promise((resolve, reject) => {
    const min = 1;
    const max = 114;
    const pages = {};

    function recursive(num) {
      indicator.style.width = loader + "%";
      // console.log(loader);
      fetch("/assets/surahs/surah_" + num + ".json")
        .then(res => res.json())
        .then(data => {
          // surahs.push(data)
          const surahName = data.name;
          const surahNum = data.number;
          const totalVerses = data.numberOfAyahs;

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
      indicator.style.width = loader + "%";
      // console.log(loader);

      const currentPageArr = pages[page];

      const content = currentPageArr
        .map(obj => {
          // console.warn(obj);
          const verseNum = String(obj.numberInSurah);
          const verseText = highlight(obj.text, godArr, "god");
          const surahName = `
          <div class="surahInfo o-grid">
          <span class="total col=3:4 row=1:2"> اياتها ${String(obj.totalVerses).toArNum()}</span>
          <span class="name col=2:3 row=1:2">${obj.surahName}</span>
          <span class="order col=1:2 row=1:2"> ترتيبها ${String(obj.surahNum).toArNum()}</span>
          </div>`;

          const pos = `data-pos="${obj.surahNum}-${verseNum}-${obj.page}"`;
          if (verseNum == 1) {
            if ([1, 9].includes(obj.surahNum)) {
              // الفاتحة و التوبة
              return `${surahName}<span class="verse" ${pos}>${verseText.trim()}<span class="num">${verseNum.toArNum()}</span></span>`;
            } else {
              return `${surahName}<h3 class="start">${highlight(
                start,
                godArr, "god"
              )}</h3><span class="verse" ${pos}>${verseText.trim()}<span class="num">${verseNum.toArNum()}</span></span>`;
            }
          }
          return `<span class="verse" ${pos}>${verseText.trim()}<span class="num">${verseNum.toArNum()}</span></span>`;
        })
        .join("");

      const div = document.createElement("div");
      div.id = "page_" + page;
      div.className = "page hide";
      div.setAttribute("data-page", String(page).toArNum());

      div.innerHTML = content;

      // page hint surah name + part num for each 21 page | we have to divid over 630 to get the right parts order
      let formula = null;
      if (page >= 2) { // start of part 1
        formula = ((+page - 1) / 603) * 30;
        if (page >= 182) formula = ((+page) / 603) * 30; // start of part 10
        if (page >= 382) formula = ((+page + 1) / 603) * 30; // start of part 20
        if (page >= 603) formula = 30; // fix last two pages

        const partNum = Math.ceil(formula);
        // console.log({ partNum, page });

        div.insertAdjacentHTML(
          "afterbegin",
          `<div class="pageHint">
        <span class="pageHint_name">${currentPageArr[0].surahName}</span>
        <span class="pageHint_part">الجزء ${String(partNum).toPartName()}</span>
        </div>`
        );

      }

      const wrapper = document.querySelector("main");
      wrapper.append(div);

      // loader
      loader = Math.ceil(((loader_0 + loader_1 + loader_2 + Number(page)) / total) * 100);
      if (loader === 100)
        setTimeout(() => {
          indicator.parentElement.classList.add("hide");
          document.body.style.overflow = "auto";
        }, 100);
    }

    resolve();
  });
}

function page(num) {
  const featuresBox = document.querySelector(".featuresBox");
  featuresBox.style.display = "none"
  const pages = document.querySelectorAll(".page");
  pages.forEach(page => page.classList.add("hide"));
  const targetPage = document.getElementById("page_" + num);
  if (targetPage) {
    targetPage.classList.remove("hide");
    localStorage.setItem("pageNum", num);
  }
}


async function init() {
  const pages = await sortPages();
  const display = await displayPages(pages);
  const num = +localStorage.getItem("pageNum") || 1;
  page(num);

  console.log("loaded book");
}

init();






