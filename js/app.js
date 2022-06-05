// todo add page number for each object in ref.json
let loader = 0;
let loader_1 = 114;
let loader_2 = 604;
let total = loader_1 + loader_2;

const indicator = document.querySelector("#loader .indicator");

function sortPages() {
  return new Promise((resolve, reject) => {
    const min = 1;
    const max = 114;
    const pages = {};

    function recursive(num) {
      indicator.style.width = loader + "%";
      // console.log(loader + "%");
      fetch("/assets/surahs/surah_" + num + ".json")
        .then(res => res.json())
        .then(data => {
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
    let partCounter = 0;

    for (let page in pages) {
      indicator.style.width = loader + "%";
      // console.log(loader + "%");

      const currentPageArr = pages[page];

      const content = currentPageArr
        .map(obj => {
          // console.warn(obj);
          const verseNum = String(obj.numberInSurah);
          const verseText = highlight(obj.text, godArr);
          const surahName = `
          <div class="surahInfo o-grid">
          <span class="order col=3:4 row=1:2"> ترتيبها ${String(obj.surahNum).toArNum()}</span>
          <span class="name col=2:3 row=1:2">${obj.surahName}</span>
          <span class="total col=1:2 row=1:2"> اياتها ${String(obj.totalVerses).toArNum()}</span>
          </div>`;

          const pos = `data-pos="${obj.surahNum}-${verseNum}-${obj.page}"`;
          if (verseNum == 1) {
            if ([1, 9].includes(obj.surahNum)) {
              // الفاتحة و التوبة
              return `${surahName}<span class="verse" ${pos}>${verseText.trim()}<span class="num">${verseNum.toArNum()}</span></span>`;
            } else {
              return `${surahName}<h3 class="start">${highlight(
                start,
                godArr
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
      if (page >= 2) {
        partCounter++;
        // const partNum = getPartNum(page);
        const partNum = Math.ceil(((+page - 1) / 603) * 30)
        console.log({partNum,page});
        
        // 
        if (partCounter + 18 == page) {
          console.log("part");
        }
        
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
      loader = Math.ceil(((loader_1 + Number(page)) / total) * 100);
      if (loader === 100)
        setTimeout(() => {
          indicator.parentElement.classList.add("hide");
          document.body.style.overflow = "auto";
        }, 100);
    }

    resolve();
  });
}

async function init() {
  const pages = await sortPages();
  const display = await displayPages(pages);
  const num = +localStorage.getItem("pageNum") || 1;
  page(num);

  console.log("loaded book");
}

init();

function page(num) {
  const pages = document.querySelectorAll(".page");
  pages.forEach(page => page.classList.add("hide"));
  const targetPage = document.getElementById("page_" + num);
  if (targetPage) {
    targetPage.classList.remove("hide");
    localStorage.setItem("pageNum", num);
  }
}

function search(str, limit = 30) {
  str = str.replace(/ى/g, "ي"); // because all reltaive letters in ref.json are "ي"
  if (ref) {
    return ref.filter(obj => obj.text.includes(str)).slice(0, limit);
    // return ref.filter(obj => obj.text.includes(str));
  }
}

// next/prev
(function () {
  let max = 604;
  let num = +localStorage.getItem("pageNum") || 1;
  const next = document.getElementById("next");
  const prev = document.getElementById("prev");

  next.onclick = function () {
    num = +localStorage.getItem("pageNum") || 1;
    if (num < max) {
      num += 1;
    }
    // console.log(num);
    page(num);
    localStorage.setItem("pageNum", num);
  };

  prev.onclick = function () {
    num = +localStorage.getItem("pageNum") || 1;
    if (num <= max && num > 1) {
      num -= 1;
    }
    // console.log(num);
    page(num);
    localStorage.setItem("pageNum", num);
  };
})();

// engine
const engine = document.getElementById("engine");
const engineClearBtn = document.getElementById("engine-clear");
engineClearBtn.onclick = e => (engine.value = "");

// todo add load more on scroll
// todo display resutls with تشكيل
engine.onkeyup = function (e) {
  const val = e.target.value.trim();
  if (e.keyCode === 13) {
    const resultsArr = search(val);
    console.log(resultsArr);
    if (resultsArr.length) {
      const content = resultsArr
        .map((obj, index) => {
          const location = `data-verse="${obj.surah}-${obj.verse}-${obj.page}"`;
          if (index === 0) return `<li class="active resultItem" ${location}>${obj.text}</li>`;
          return `<li class="resultItem" ${location}>${obj.text}</li>`;
        })
        .join("");

      oConfirm({
        title: "البحث فى المصحف",
        desc: `<ul class='o-list searchPanel'>${content}</ul>`,
        btns: { cancel: { exists: true, text: "الغاء" }, okay: { text: "اذهب الى الأية" } },
      }).then(res => {
        if (res) {
          console.log("ok");
          goToVerse();
        } else {
          console.log("cancel");
        }
      });
      // default verse | 1st verse
      verseLocation = { surah: resultsArr[0].surah, verse: resultsArr[0].verse, page: resultsArr[0].page };
    } else {
      oAlert({
        title: "البحث فى المصحف",
        desc: "لايوجد نتائج",
        okay: { text: "حسنا" },
      });
    }
  }
};

// handle results
document.onclick = function (e) {
  if (e.target.classList.contains("resultItem")) {
    console.log(e.target);
    // ui
    const items = e.target.parentElement.querySelectorAll(".active");
    items.forEach(item => item.classList.remove("active"));
    e.target.classList.add("active");
    // data
    const [surah, verse, page] = e.target.getAttribute("data-verse").split("-");
    const verseData = { surah: +surah, verse: +verse, page: +page };
    verseLocation = verseData;
  }
};

// detect verse for saving
document.body.onclick = function (e) {
  if (e.target.classList.contains("verse")) {
    console.log(e.target, e.target.getAttribute("data-pos"));
  }
};

function goToVerse() {
  console.log(verseLocation);
  const posAttr = `[data-pos="${verseLocation.surah}-${verseLocation.verse}-${verseLocation.page}"]`;
  if (verseLocation) {
    page(verseLocation.page);
    const verse = document.querySelector(posAttr);
    console.log(verse);
    if (verse) {
      verse.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
      verse.classList.add("highlight");
      setTimeout(() => verse.classList.remove("highlight"), 3000);
    }
  }
}
