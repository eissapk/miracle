const featuresBox = document.querySelector(".featuresBox");
const bookmarkPageBtn = document.querySelector("#bookmarkPage");

// detect verse for saving
document.body.addEventListener("click", e => {
  e = e || window.event;

  if (e.target.classList.contains("verse")) {
    const verseElm = e.target;
    const newElm = verseElm.cloneNode(true);
    newElm.querySelector(".num").remove();

    const [surah, verse, page] = verseElm.getAttribute("data-pos").split("-");
    const order = verseElm.getAttribute("data-order");
    if (featuresBox) {
      const top = e.pageY - 75;
      featuresBox.style.display = "block";
      featuresBox.style.top = top + "px";

      // save verse
      const saveVerseBtn = featuresBox.querySelector("#saveVerse");
      saveVerseBtn.onclick = function (e) {
        const info = { surah, verse, page, text: newElm.textContent };
        console.log(info);
        const savedVersesArr = JSON.parse(localStorage.getItem("bookmarkedVerses")) || []
        if (savedVersesArr) {
          const hasSameVerse = savedVersesArr.find(obj => {
            if (obj.page == info.page && obj.verse == info.verse && obj.page == info.page) return obj;
          })

          if (!hasSameVerse) {
            savedVersesArr.push(info);
            localStorage.setItem("bookmarkedVerses", JSON.stringify(savedVersesArr))

          }

        }
      }

      // explain verse
      const explainVerseBtn = featuresBox.querySelector("#explainVerse");
      explainVerseBtn.onclick = function (e) {
        // get all explanation names @ http://api.alquran.cloud/v1/edition/format/text
        // http://api.alquran.cloud/ayah/27:44/editions/ar.muyassar
        let ref = "muyassar";
        // ref = "jalalayn";
        const url = "http://api.alquran.cloud/ayah/" + surah + ":" + verse + "/editions/ar." + ref;
        fetch(url).then(res => res.json()).then(res => {
          const text = res.data[0].text;
          oAlert({
            title: "الميسر",
            desc: text,
            okay: { text: "حسنا" },
          });
        }).catch(console.error)
      }

      // read verse
      const readVerseBtn = featuresBox.querySelector("#readVerse");
      readVerseBtn.onclick = function (e) {
        // https://raw.githubusercontent.com/islamic-network/cdn/master/info/cdn.txt
        // http://api.alquran.cloud/edition/format/audio
        // https://cdn.islamic.network/quran/audio/64/ar.mahermuaiqly/8.mp3
        let reciter = "mahermuaiqly";
        reciter = "husary"
        reciter = "ahmedajamy"
        const rate = 64;
        const verseOrder = order; // from 1:6236
        const url = "https://cdn.islamic.network/quran/audio/" + rate + "/ar." + reciter + "/" + verseOrder + ".mp3";

        const audio = new Audio();
        audio.src = url;
        audio.play();
      }

      // trans verse
      const transVerseBtn = featuresBox.querySelector("#transVerse");
      transVerseBtn.onclick = function (e) {
        // http://api.alquran.cloud/v1/edition/type/translation
        // http://api.alquran.cloud/v1/ayah/27:46/en.ahmedraza
        let ref = "ahmedraza";
        const url = "http://api.alquran.cloud/v1/ayah/" + surah + ":" + verse + "/en." + ref;
        fetch(url).then(res => res.json()).then(res => {
          const text = res.data.text;
          oAlert({
            title: "ahmedraza",
            desc: text,
            okay: { text: "حسنا" },
          });
        }).catch(console.error)
      }

    }

  }
})

// save current page
bookmarkPageBtn.onclick = function () {
  const savedPagesArr = JSON.parse(localStorage.getItem("bookmarkedPages")) || []
  const pageElm = document.getElementById(`page_${currentPageNum}`);
  const name = pageElm.querySelector(".pageHint_name").textContent;
  const part = pageElm.querySelector(".pageHint_part").textContent;
  const obj = { page: currentPageNum, name, part };
  console.log(obj);
  savedPagesArr.push(obj);
  localStorage.setItem("bookmarkedPages", JSON.stringify(savedPagesArr))
}