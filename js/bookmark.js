const featuresBox = document.querySelector(".featuresBox");
// detect verse for saving
document.body.addEventListener("click", e => {
  e = e || window.event;

  if (e.target.classList.contains("verse")) {
    const verseElm = e.target;
    const [surah, verse, page] = verseElm.getAttribute("data-pos").split("-");
    if (featuresBox) {
      const top = e.pageY - 75;
      featuresBox.style.display = "block";
      featuresBox.style.top = top + "px";

      const saveVerseBtn = featuresBox.querySelector("#saveVerse");
      saveVerseBtn.onclick = function (e) {
        const info = { surah, verse, page };
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

    }

  }
})

