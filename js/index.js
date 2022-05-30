// todo display context as each page in real quoran
let start = "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ";
let ref;
let list;

let godArr = [
    "هو",
    "الله",
    "رب",
    "ربهم",
    "ربكم",
    "ربك",
    "ربه",
    "ربنا",
    "لرب",
    "ربي",
    "ربها",
    "لربك",
    "ربكما",
    "ربهما",
    "ربها",
]


const normalize = input => {
    return (
        input
        // remove signs
        .replaceAll("\u0610", "") //ARABIC SIGN SALLALLAHOU ALAYHE WA SALLAM
        .replaceAll("\u0611", "") //ARABIC SIGN ALAYHE ASSALLAM
        .replaceAll("\u0612", "") //ARABIC SIGN RAHMATULLAH ALAYHE
        .replaceAll("\u0613", "") //ARABIC SIGN RADI ALLAHOU ANHU
        .replaceAll("\u0614", "") //ARABIC SIGN TAKHALLUS

        // Remove koranic anotation
        .replaceAll("\u0615", "") //ARABIC SMALL HIGH TAH
        .replaceAll("\u0616", "") //ARABIC SMALL HIGH LIGATURE ALEF WITH LAM WITH YEH
        .replaceAll("\u0617", "") //ARABIC SMALL HIGH ZAIN
        .replaceAll("\u0618", "") //ARABIC SMALL FATHA
        .replaceAll("\u0619", "") //ARABIC SMALL DAMMA
        .replaceAll("\u061A", "") //ARABIC SMALL KASRA
        .replaceAll("\u06D6", "") //ARABIC SMALL HIGH LIGATURE SAD WITH LAM WITH ALEF MAKSURA
        .replaceAll("\u06D7", "") //ARABIC SMALL HIGH LIGATURE QAF WITH LAM WITH ALEF MAKSURA
        .replaceAll("\u06D8", "") //ARABIC SMALL HIGH MEEM INITIAL FORM
        .replaceAll("\u06D9", "") //ARABIC SMALL HIGH LAM ALEF
        .replaceAll("\u06DA", "") //ARABIC SMALL HIGH JEEM
        .replaceAll("\u06DB", "") //ARABIC SMALL HIGH THREE DOTS
        .replaceAll("\u06DC", "") //ARABIC SMALL HIGH SEEN
        .replaceAll("\u06DD", "") //ARABIC END OF AYAH
        .replaceAll("\u06DE", "") //ARABIC START OF RUB EL HIZB
        .replaceAll("\u06DF", "") //ARABIC SMALL HIGH ROUNDED ZERO
        .replaceAll("\u06E0", "") //ARABIC SMALL HIGH UPRIGHT RECTANGULAR ZERO
        .replaceAll("\u06E1", "") //ARABIC SMALL HIGH DOTLESS HEAD OF KHAH
        .replaceAll("\u06E2", "") //ARABIC SMALL HIGH MEEM ISOLATED FORM
        .replaceAll("\u06E3", "") //ARABIC SMALL LOW SEEN
        .replaceAll("\u06E4", "") //ARABIC SMALL HIGH MADDA
        .replaceAll("\u06E5", "") //ARABIC SMALL WAW
        .replaceAll("\u06E6", "") //ARABIC SMALL YEH
        .replaceAll("\u06E7", "") //ARABIC SMALL HIGH YEH
        .replaceAll("\u06E8", "") //ARABIC SMALL HIGH NOON
        .replaceAll("\u06E9", "") //ARABIC PLACE OF SAJDAH
        .replaceAll("\u06EA", "") //ARABIC EMPTY CENTRE LOW STOP
        .replaceAll("\u06EB", "") //ARABIC EMPTY CENTRE HIGH STOP
        .replaceAll("\u06EC", "") //ARABIC ROUNDED HIGH STOP WITH FILLED CENTRE
        .replaceAll("\u06ED", "") //ARABIC SMALL LOW MEEM

        //Remove tatweel
        .replaceAll("\u0640", "")

        //Remove tashkeel
        .replaceAll("\u064B", "") //ARABIC FATHATAN
        .replaceAll("\u064C", "") //ARABIC DAMMATAN
        .replaceAll("\u064D", "") //ARABIC KASRATAN
        .replaceAll("\u064E", "") //ARABIC FATHA
        .replaceAll("\u064F", "") //ARABIC DAMMA
        .replaceAll("\u0650", "") //ARABIC KASRA
        .replaceAll("\u0651", "") //ARABIC SHADDA
        .replaceAll("\u0652", "") //ARABIC SUKUN
        .replaceAll("\u0653", "") //ARABIC MADDAH ABOVE
        .replaceAll("\u0654", "") //ARABIC HAMZA ABOVE
        .replaceAll("\u0655", "") //ARABIC HAMZA BELOW
        .replaceAll("\u0656", "") //ARABIC SUBSCRIPT ALEF
        .replaceAll("\u0657", "") //ARABIC INVERTED DAMMA
        .replaceAll("\u0658", "") //ARABIC MARK NOON GHUNNA
        .replaceAll("\u0659", "") //ARABIC ZWARAKAY
        .replaceAll("\u065A", "") //ARABIC VOWEL SIGN SMALL V ABOVE
        .replaceAll("\u065B", "") //ARABIC VOWEL SIGN INVERTED SMALL V ABOVE
        .replaceAll("\u065C", "") //ARABIC VOWEL SIGN DOT BELOW
        .replaceAll("\u065D", "") //ARABIC REVERSED DAMMA
        .replaceAll("\u065E", "") //ARABIC FATHA WITH TWO DOTS
        .replaceAll("\u065F", "") //ARABIC WAVY HAMZA BELOW
        .replaceAll("\u0670", "") //ARABIC LETTER SUPERSCRIPT ALEF
        .replaceAll("ࣰ", "")
        .replaceAll("ࣱ", "")
        .replaceAll("ࣲ", "")
        .replaceAll("ࣳ", "")

        // handle special letter
        .replace(/ی|ى/g, "ي") // here two letters look the same but actually they are not
        .replace(/ﻻ/g, "لا")
        .replace(/آ|إ|أ|ٱ/g, "ا")
        .replace(/ڛ/g, "س")
        .replace(/چ/g, "ج")
    );
};


function highlight(str, arr) {
    let chunks = str.split(" ");
    let targetWords = [];
    chunks.forEach(word => {
        const normalWord = normalize(word);
        const index = arr.indexOf(normalWord)
        if (index != -1) targetWords.push(word);
    });
    
    targetWords = [...new Set(targetWords)] // remove duplication

    // console.log(targetWords);
    targetWords.forEach(word => str = str.replace(new RegExp(`${word}`, "g"), `<span class="god">${word}</span>`))
    return str;
}



String.prototype.toArNum = function () {
    const digits = {
        "0": "٠",
        "1": "١",
        "2": "٢",
        "3": "٣",
        "4": "٤",
        "5": "٥",
        "6": "٦",
        "7": "٧",
        "8": "٨",
        "9": "٩",
    };
    return this.replace(/[0-9]/g, d => digits[d]);
}

fetch("/assets/ref.json").then(res => res.json()).then(data => (ref = data)).catch(console.error);
fetch("/assets/list.json").then(res => res.json()).then(data => (list = data)).catch(console.error);

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
            const surahText = data.ayahs.map((obj, index) => {
                const pos = `data-pos="${data.number}-${obj.numberInSurah}"`;
                return `<span class="verse" ${pos}>${highlight(obj.text, godArr)}<span class="verseNum" ${pos}>${String(index+1).toArNum()}</span></span>`;
            }).join("");
            if ([1, 9].includes(data.number)) {
                content.innerHTML = `
                <h4>
                    ${data.name}
                    <span class="verseNum">${String(data.number).toArNum()}</span>
                </h4>
                <div class="text">
                    ${surahText}
                </div>
                `;
            } else {
                content.innerHTML = `
                <h4>
                    ${data.name}
                    <span class="verseNum">${String(data.number).toArNum()}</span>
                </h4> 
                <p class="start">${highlight(start, godArr)}</p>
                <div class="text">
                    ${surahText}
                </div>
                `;
            }
            
            // wrape all text nodes into span element for better formatting with css
            const nodes = content.querySelectorAll(".text .verse");
            nodes.forEach(node => {
                node.childNodes.forEach(item => {
                    if (item.nodeType === 3) { // text
                        const span = document.createElement("span");
                        span.textContent = item.textContent;
                        item.replaceWith(span)
                    }
                    
                })
            })
            console.warn();
            
        })
        .catch(console.error);
}

function slide() {
    let max = 114;
    let num = +localStorage.getItem("surahNum") || 1;
    const next = document.getElementById("next");
    const prev = document.getElementById("prev");

    next.onclick = function () {
        if (num < max) {
            num += 1;
        }
        console.log(num);
        display(num);
        localStorage.setItem("surahNum", num);
    };

    prev.onclick = function () {
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

document.body.onclick = function (e) {
    if (e.target.classList.contains("verse")) {
        console.warn(e.target.textContent);
    }
}