const engine = document.getElementById("engine");
const engineClearBtn = document.getElementById("engine-clear");

// todo search exact word
function search(str, limit = 30) {
  str = str.replace(/ى/g, "ي"); // because all reltaive letters in ref.json are "ي"
  if (ref) {
    const resultsArr = ref.filter(obj => normalize(obj.text).trim().includes(str));
    const firstChunck = resultsArr.slice(0, limit);
    return { length: resultsArr.length, resultsArr: firstChunck }
  }
}

// engine
engineClearBtn.onclick = e => (engine.value = "");

engine.onkeyup = function (e) {
  const val = e.target.value.trim();
  if (e.keyCode === 13) {
    let { resultsArr, length } = search(val, 31); // todo check length === 31 then show 30 and load others onclick loadmorebtn
    console.log(resultsArr, length);
    if (resultsArr.length) {
      const content = resultsArr
        .map((obj, index) => {
          const info = `<i>${obj.name} - أية:${String(obj.verse).toArNum()} (صفحة ${String(obj.page).toArNum()})</i>`;
          const location = `data-verse="${obj.surah}-${obj.verse}-${obj.page}"`;
          if (index === 0) return `<li class="active resultItem" ${location}>${highlight(obj.text, [val], "query")}<br/>${info}</li>`;
          return `<li class="resultItem" ${location}>${highlight(obj.text, [val], "query")}<br/>${info}</li>`;
        })
        .join("");

      let lengthDesc = "نتيجة";

      oConfirm({
        title: "البحث فى المصحف",
        desc: `<p class="length">${length.toLocaleString().toArNum()} ${lengthDesc}</p><ul class='o-list searchPanel'>${content} <button class="o-btn loadMoreBtn" style="margin: 10px 0;">اظهر المزيد</button></ul>`,
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
document.addEventListener("click", e => {
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
});

function goToVerse() {
  console.log(verseLocation);
  const posAttr = `[data-pos="${verseLocation.surah}-${verseLocation.verse}-${verseLocation.page}"]`;
  if (verseLocation) {
    page(verseLocation.page);
    const verse = document.querySelector(posAttr);
    console.log(verse);
    if (verse) {
      verse.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      verse.classList.add("highlight");
      setTimeout(() => verse.classList.remove("highlight"), 3000);
    }
  }
}