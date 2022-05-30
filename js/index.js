// todo display context as each page in real quoran
let start = "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ";
let ref;
let list;

String.prototype.toArNum = function() {
    const digits = { "0": "٠", "1": "١", "2": "٢", "3": "٣", "4": "٤", "5": "٥", "6": "٦", "7": "٧", "8": "٨", "9": "٩", };
    return this.replace(/[0-9]/g, d => digits[d]);
}

fetch("/assets/ref.json")
    .then(res => res.json())
    .then(data => (ref = data))
    .catch(console.error);


fetch("/assets/list.json")
    .then(res => res.json())
    .then(data => (list = data))
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
            localStorage.setItem("surahNum", num);
            const surahText = data.ayahs.map((obj, index) => `<p data-pos="${data.number}-${obj.numberInSurah}"><span class="verse">${obj.text} (${String(index+1).toArNum()})</span></p>`).join("");
            if ([1, 9].includes(data.number)) {
                content.innerHTML = "<h4>" + data.name + "<span> (" + String(data.number).toArNum() + ") </span>" + "</h4>" + surahText;
            } else {
                content.innerHTML = "<h4>" + data.name + "<span> (" + String(data.number).toArNum() + ") </span>" + "</h4>" + "<h3>" + start + "</h3>" + surahText;
            }
        })
        .catch(console.error);
}

function slide() {
    let max = 114;
    let num = +localStorage.getItem("surahNum") || 1;
    const next = document.getElementById("next");
    const prev = document.getElementById("prev");

    next.onclick = function() {
        if (num < max) {
            num += 1;
        }
        console.log(num);
        display(num);
        localStorage.setItem("surahNum", num);
    };

    prev.onclick = function() {
        if (num <= max && num > 1) {
            num -= 1;
        }
        console.log(num);
        display(num);
        localStorage.setItem("surahNum", num);

    };

    console.log(num);
    display(num);

}

slide();