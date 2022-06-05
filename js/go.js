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

