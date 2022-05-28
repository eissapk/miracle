// todo add more info to ref.json like name of surah
let ref;

fetch("/assets/ref.json")
  .then(res => res.json())
  .then(data => (ref = data))
  .catch(console.error);

function search(str, limit = 30) {
  str = str.replace(/ى/g, "ي");
  if (ref) {
    // return ref.filter(obj => obj.text.includes(str)).slice(0, limit);
    return ref.filter(obj => obj.text.includes(str));
  }
}

const content = document.getElementById("content");
function display(num) {
  fetch("/assets/surahs/surah_" + num + ".json")
    .then(res => res.json())
    .then(data => {
      const surahText = data.ayahs.map(obj => `<p>${obj.text}</p>`).join("");
      content.innerHTML = surahText;
    })
    .catch(console.error);
}

function slide() {
  let max = 114;
  let num = 1;
  const next = document.getElementById("next");
  const prev = document.getElementById("prev");

  next.onclick = function () {
    if (num < max) {
      num += 1;
    }
    console.log(num);
    display(num);
  };

  prev.onclick = function () {
    if (num <= max && num > 1) {
      num -= 1;
    }
    console.log(num);
    display(num);
  };
  
  console.log(num);
  display(num);
}

slide();
