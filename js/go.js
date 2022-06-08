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


// go to specific page by number
const gotoPageNum = document.getElementById("gotoPageNum");
gotoPageNum.onkeyup = function (e) {
  const val = e.target.value.trim();
  if (e.keyCode === 13) page(+val);
}

// go to specific page by number
const gotoPartNum = document.getElementById("gotoPartNum");
gotoPartNum.onkeyup = function (e) {
  const val = e.target.value.trim();
  if (e.keyCode === 13) page(+getFirstPage(+val));
}

// handle toc
const tocBtn = document.getElementById("tocBtn");
if (tocBtn) {
  tocBtn.onclick = function () {
    if (list) {
      let content = list.map(obj => {
        return `<tr data-page="${obj.page}">
        <td class="toc_item name">${obj.name}</td>
        <td class="toc_item">${String(obj.surah).toArNum()}</td>
        <td class="toc_item">${String(obj.page).toArNum()}</td>
        <td class="toc_item">${obj.type === "medinan" ? "مكية" : "مدنية"}</td>
        </tr>`
      }).join("");

      oAlert({
        desc: `
        <input type="text" class="o-input searchSurahsInput" placeholder="ابحث عن سورة">
        
        <div class="tocPanel">
        <table>
        <thead>
          <td>السور</td>
          <td>رقمها</td>
          <td>الصحيفة</td>
          <td>البيان</td>
        </thead>
        <tbody>
          ${content}
        </tbody>
        </table>
        </div>
        `,
        okay: { text: "حسنا" },
      }).then(res => {
        if (res) {
          console.log("ok");
        }
      })
    }
  }
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("toc_item")) {
    const num = +e.target.parentElement.getAttribute("data-page");
    page(num);

    // todo handle olum-ui to close the instance of oAlert/oConfirm
    // todo add focus to okay button
    const btn = document.querySelector(".o-popup .okBtn");
    btn.click();
  }

})

document.body.addEventListener("keyup", e => {
  if (e.target.classList.contains("searchSurahsInput")) {
    if (e.keyCode === 13) {
      const val = e.target.value.trim()
      const rows = document.querySelectorAll(".tocPanel tbody tr");
      rows.forEach(row => {
        let td = row.querySelector("td.name");
        const name = normalize(td.textContent).trim();
        row.classList.add("hide");
        if (name.includes(val)) row.classList.remove("hide");
      })
    }
  }
});

// todo go to specific verse in specific surah