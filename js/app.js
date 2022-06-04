let loader = 0;
let max = 114;
const loaderContainer = document.getElementById("loader");

function recursive(num) {
  loaderContainer.style.width = loader + "%";

  fetch("/assets/surahs/surah_" + num + ".json")
    .then(res => res.json())
    .then(data => {
      const surahName = data.name;
      const surahNum = data.number;
      const verses = data.ayahs;

      // todo handle 3 surahs in the same page
      // start handle pages
      let currentPages = [];
      verses.forEach(obj => currentPages.push(obj.page));
      currentPages = [...new Set(currentPages)];
      // end handle pages

      currentPages.forEach(pageNum => {
        const page = verses.map(obj => (obj.page === pageNum ? obj : null)).filter(item => item);
        const content = page
          .map(obj => {
            const verseNum = String(obj.numberInSurah);
            const verseText = highlight(obj.text, godArr);
            return `<span class="verse" data-pos="${surahNum}-${verseNum}">${verseText.trim()}<span class="num">${verseNum.toArNum()}</span></span>`;
          })
          .join("");
        const div = document.createElement("div");
        div.id = "page_" + pageNum;
        div.className = "page hide";

        div.innerHTML = content;

        const wrapper = document.querySelector("main");
        wrapper.append(div);
        // console.log(pageNum, page);
      });

      if (num + 1 <= max) {
        loader = Math.ceil((num / max) * 100);
        if (loader === 100) {
          loaderContainer.classList.add("hide");
        }
        recursive(num + 1);
      }
    })
    .catch(console.error);
}

recursive(1);

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
