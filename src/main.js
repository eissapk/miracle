// todo go to specific verse in specific surah
// todo add سجدة/حزب
//todo engine options["tashkil", "extact match", "limit"]
import book from "./services/book";
window.book = book;
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
const app = createApp(App);
app.use(router);
app.mount('#app');

// mixins
app.mixin({
  data() {
    return {
    }
  },
  methods: {
  }
})

// filters
app.config.globalProperties.$filters = {
  normalize(input) {
    return input
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