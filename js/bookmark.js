// detect verse for saving
document.body.onclick = function (e) {
  if (e.target.classList.contains("verse")) {
    console.log(e.target, e.target.getAttribute("data-pos"));
  }
};

