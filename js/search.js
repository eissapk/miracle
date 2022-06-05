const engine = document.getElementById("engine");
const engineClearBtn = document.getElementById("engine-clear");

function search(str, limit = 30) {
  str = str.replace(/ى/g, "ي"); // because all reltaive letters in ref.json are "ي"
  if (ref) {
    return ref.filter(obj => obj.text.includes(str)).slice(0, limit);
    // return ref.filter(obj => obj.text.includes(str));
  }
}

// engine
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