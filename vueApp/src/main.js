import * as Vue from 'vue'
import App from './App.vue'
import router from './router'

// todo add حزب
// todo add guide for initial use of the app

// start global
import book from "./services/book";
window.book = book;
import popup from "./services/popup.js";
window.oConfirm = popup.oConfirm;
window.oAlert = popup.oAlert;
// end global

const app = Vue.createApp(App)
app.use(router)
app.mount('#app')

// Now the app has started!

// mixins
// app.mixin({
//   data() {
//     return {
//     }
//   },
//   methods: {
//   }
// })

// filters
app.config.globalProperties.$filters = {
  normalize(input) {
    return input
      // remove signs
      .replace(/\u0610/g, "") //ARABIC SIGN SALLALLAHOU ALAYHE WA SALLAM
      .replace(/\u0611/g, "") //ARABIC SIGN ALAYHE ASSALLAM
      .replace(/\u0612/g, "") //ARABIC SIGN RAHMATULLAH ALAYHE
      .replace(/\u0613/g, "") //ARABIC SIGN RADI ALLAHOU ANHU
      .replace(/\u0614/g, "") //ARABIC SIGN TAKHALLUS

      // Remove koranic anotation
      .replace(/\u0615/g, "") //ARABIC SMALL HIGH TAH
      .replace(/\u0616/g, "") //ARABIC SMALL HIGH LIGATURE ALEF WITH LAM WITH YEH
      .replace(/\u0617/g, "") //ARABIC SMALL HIGH ZAIN
      .replace(/\u0618/g, "") //ARABIC SMALL FATHA
      .replace(/\u0619/g, "") //ARABIC SMALL DAMMA
      .replace(/\u061A/g, "") //ARABIC SMALL KASRA
      .replace(/\u06D6/g, "") //ARABIC SMALL HIGH LIGATURE SAD WITH LAM WITH ALEF MAKSURA
      .replace(/\u06D7/g, "") //ARABIC SMALL HIGH LIGATURE QAF WITH LAM WITH ALEF MAKSURA
      .replace(/\u06D8/g, "") //ARABIC SMALL HIGH MEEM INITIAL FORM
      .replace(/\u06D9/g, "") //ARABIC SMALL HIGH LAM ALEF
      .replace(/\u06DA/g, "") //ARABIC SMALL HIGH JEEM
      .replace(/\u06DB/g, "") //ARABIC SMALL HIGH THREE DOTS
      .replace(/\u06DC/g, "") //ARABIC SMALL HIGH SEEN
      .replace(/\u06DD/g, "") //ARABIC END OF AYAH
      .replace(/\u06DE/g, "") //ARABIC START OF RUB EL HIZB
      .replace(/\u06DF/g, "") //ARABIC SMALL HIGH ROUNDED ZERO
      .replace(/\u06E0/g, "") //ARABIC SMALL HIGH UPRIGHT RECTANGULAR ZERO
      .replace(/\u06E1/g, "") //ARABIC SMALL HIGH DOTLESS HEAD OF KHAH
      .replace(/\u06E2/g, "") //ARABIC SMALL HIGH MEEM ISOLATED FORM
      .replace(/\u06E3/g, "") //ARABIC SMALL LOW SEEN
      .replace(/\u06E4/g, "") //ARABIC SMALL HIGH MADDA
      .replace(/\u06E5/g, "") //ARABIC SMALL WAW
      .replace(/\u06E6/g, "") //ARABIC SMALL YEH
      .replace(/\u06E7/g, "") //ARABIC SMALL HIGH YEH
      .replace(/\u06E8/g, "") //ARABIC SMALL HIGH NOON
      .replace(/\u06E9/g, "") //ARABIC PLACE OF SAJDAH
      .replace(/\u06EA/g, "") //ARABIC EMPTY CENTRE LOW STOP
      .replace(/\u06EB/g, "") //ARABIC EMPTY CENTRE HIGH STOP
      .replace(/\u06EC/g, "") //ARABIC ROUNDED HIGH STOP WITH FILLED CENTRE
      .replace(/\u06ED/g, "") //ARABIC SMALL LOW MEEM

      //Remove tatweel
      .replace(/\u0640/g, "")

      //Remove tashkeel
      .replace(/\u064B/g, "") //ARABIC FATHATAN
      .replace(/\u064C/g, "") //ARABIC DAMMATAN
      .replace(/\u064D/g, "") //ARABIC KASRATAN
      .replace(/\u064E/g, "") //ARABIC FATHA
      .replace(/\u064F/g, "") //ARABIC DAMMA
      .replace(/\u0650/g, "") //ARABIC KASRA
      .replace(/\u0651/g, "") //ARABIC SHADDA
      .replace(/\u0652/g, "") //ARABIC SUKUN
      .replace(/\u0653/g, "") //ARABIC MADDAH ABOVE
      .replace(/\u0654/g, "") //ARABIC HAMZA ABOVE
      .replace(/\u0655/g, "") //ARABIC HAMZA BELOW
      .replace(/\u0656/g, "") //ARABIC SUBSCRIPT ALEF
      .replace(/\u0657/g, "") //ARABIC INVERTED DAMMA
      .replace(/\u0658/g, "") //ARABIC MARK NOON GHUNNA
      .replace(/\u0659/g, "") //ARABIC ZWARAKAY
      .replace(/\u065A/g, "") //ARABIC VOWEL SIGN SMALL V ABOVE
      .replace(/\u065B/g, "") //ARABIC VOWEL SIGN INVERTED SMALL V ABOVE
      .replace(/\u065C/g, "") //ARABIC VOWEL SIGN DOT BELOW
      .replace(/\u065D/g, "") //ARABIC REVERSED DAMMA
      .replace(/\u065E/g, "") //ARABIC FATHA WITH TWO DOTS
      .replace(/\u065F/g, "") //ARABIC WAVY HAMZA BELOW
      .replace(/\u0670/g, "") //ARABIC LETTER SUPERSCRIPT ALEF
      .replace(/ࣰ/g, "")
      .replace(/ࣱ/g, "")
      .replace(/ࣲ/g, "")
      .replace(/ࣳ/g, "")
      .replace(/ﱢ/g, "")
      .replace(/ﱠ/g, "")

      // handle special letter
      .replace(/ی|ى/g, "ي") // here two letters look the same but actually they are not
      .replace(/ﻻ/g, "لا")
      .replace(/آ|إ|أ|ٱ/g, "ا")
      .replace(/ڛ/g, "س")
      .replace(/چ/g, "ج")
  },

  // get 1st page from part number
  getFirstPage(part) {
    return +((part - 1) * 2 + "2");
  },

  // get last page from part number
  getLastPage(part) {
    return this.getFirstPage(part) + 19;
  },

  highlight(str, arr, className) {
    str = str.replace(/۞/g, `<span class="hizb">۞</span>`);
    let chunks = str.split(" ");
    let targetWords = [];
    chunks.forEach(word => {
      const normalWord = this.normalize(word);
      const index = arr.indexOf(normalWord);
      if (index != -1) targetWords.push(word);
    });

    targetWords = [...new Set(targetWords)]; // remove duplication

    // console.log(targetWords);
    targetWords.forEach(word => str = str.replace(new RegExp(`${word}`, "g"), `<span class="${className}">${word}</span>`));
    return str;
  },
  arNum(num) {
    const digits = {
      0: "٠",
      1: "١",
      2: "٢",
      3: "٣",
      4: "٤",
      5: "٥",
      6: "٦",
      7: "٧",
      8: "٨",
      9: "٩",
    };
    return String(num).replace(/[0-9]/g, d => digits[d]);
  },
  juz(num) {
    const digits = {
      1: "الاول",
      2: "الثانى",
      3: "الثالث",
      4: "الرابع",
      5: "الخامس",
      6: "السادس",
      7: "السابع",
      8: "الثامن",
      9: "التاسع",
      10: "العاشر",
      11: "الحادى عشر",
      12: "الثانى عشر",
      13: "الثالث عشر",
      14: "الرابع عشر",
      15: "الخامس عشر",
      16: "السادس عشر",
      17: "السابع عشر",
      18: "الثامن عشر",
      19: "التاسع عشر",
      20: "العشرون",
      21: "الحادى والعشرون",
      22: "الثانى والعشرون",
      23: "الثالث والعشرون",
      24: "الرابع والعشرون",
      25: "الخامس والعشرون",
      26: "السادس والعشرون",
      27: "السابع والعشرون",
      28: "الثامن والعشرون",
      29: "التاسع والعشرون",
      30: "الثلاثون",
    };
    return "الجزء " + digits[num];
  },
  surahType(str) {
    return str.trim().toLowerCase() === "mec" ? "مكية" : "مدنية";
  }
}

// directives
app.directive('arNum', {
  beforeMount(el, binding, vnode) {
    const digits = {
      0: "٠",
      1: "١",
      2: "٢",
      3: "٣",
      4: "٤",
      5: "٥",
      6: "٦",
      7: "٧",
      8: "٨",
      9: "٩",
    };
    el.textContent = el.textContent.replace(/[0-9]/g, d => digits[d]);
  }
})

app.directive("juz", {
  beforeMount(el) {
    const digits = {
      1: "الاول",
      2: "الثانى",
      3: "الثالث",
      4: "الرابع",
      5: "الخامس",
      6: "السادس",
      7: "السابع",
      8: "الثامن",
      9: "التاسع",
      10: "العاشر",
      11: "الحادى عشر",
      12: "الثانى عشر",
      13: "الثالث عشر",
      14: "الرابع عشر",
      15: "الخامس عشر",
      16: "السادس عشر",
      17: "السابع عشر",
      18: "الثامن عشر",
      19: "التاسع عشر",
      20: "العشرون",
      21: "الحادى والعشرون",
      22: "الثانى والعشرون",
      23: "الثالث والعشرون",
      24: "الرابع والعشرون",
      25: "الخامس والعشرون",
      26: "السادس والعشرون",
      27: "السابع والعشرون",
      28: "الثامن والعشرون",
      29: "التاسع والعشرون",
      30: "الثلاثون",
    };
    el.textContent = "الجزء " + digits[el.textContent.trim()];
  }
})

app.directive('surahType', {
  beforeMount(el, binding, vnode) {
    el.textContent = el.textContent.trim() === "mec" ? "مكية" : "مدنية";
  }
})
