export function normalize(input) {
  return input
    .replace(/ؐ/g, "").replace(/ؑ/g, "").replace(/ؒ/g, "")
    .replace(/ؓ/g, "").replace(/ؔ/g, "").replace(/ؕ/g, "")
    .replace(/ؖ/g, "").replace(/ؗ/g, "").replace(/ؘ/g, "")
    .replace(/ؙ/g, "").replace(/ؚ/g, "").replace(/ۖ/g, "")
    .replace(/ۗ/g, "").replace(/ۘ/g, "").replace(/ۙ/g, "")
    .replace(/ۚ/g, "").replace(/ۛ/g, "").replace(/ۜ/g, "")
    .replace(/۝/g, "").replace(/۞/g, "").replace(/۟/g, "")
    .replace(/۠/g, "").replace(/ۡ/g, "").replace(/ۢ/g, "")
    .replace(/ۣ/g, "").replace(/ۤ/g, "").replace(/ۥ/g, "")
    .replace(/ۦ/g, "").replace(/ۧ/g, "").replace(/ۨ/g, "")
    .replace(/۩/g, "").replace(/۪/g, "").replace(/۫/g, "")
    .replace(/۬/g, "").replace(/ۭ/g, "").replace(/ـ/g, "")
    .replace(/ً/g, "").replace(/ٌ/g, "").replace(/ٍ/g, "")
    .replace(/َ/g, "").replace(/ُ/g, "").replace(/ِ/g, "")
    .replace(/ّ/g, "").replace(/ْ/g, "").replace(/ٓ/g, "")
    .replace(/ٔ/g, "").replace(/ٕ/g, "").replace(/ٖ/g, "")
    .replace(/ٗ/g, "").replace(/٘/g, "").replace(/ٙ/g, "")
    .replace(/ٚ/g, "").replace(/ٛ/g, "").replace(/ٜ/g, "")
    .replace(/ٝ/g, "").replace(/ٞ/g, "").replace(/ٟ/g, "")
    .replace(/ٰ/g, "").replace(/ࣰ/g, "").replace(/ࣱ/g, "")
    .replace(/ࣲ/g, "").replace(/ࣳ/g, "").replace(/ﱢ/g, "").replace(/ﱠ/g, "")
    .replace(/ی|ى/g, "ي").replace(/ﻻ/g, "لا")
    .replace(/آ|إ|أ|ٱ/g, "ا").replace(/ڛ/g, "س").replace(/چ/g, "ج");
}

export function arNum(num) {
  const digits = { 0: "٠", 1: "١", 2: "٢", 3: "٣", 4: "٤", 5: "٥", 6: "٦", 7: "٧", 8: "٨", 9: "٩" };
  return String(num).replace(/[0-9]/g, d => digits[d]);
}

export function juz(num) {
  const digits = {
    1: "الاول", 2: "الثانى", 3: "الثالث", 4: "الرابع", 5: "الخامس",
    6: "السادس", 7: "السابع", 8: "الثامن", 9: "التاسع", 10: "العاشر",
    11: "الحادى عشر", 12: "الثانى عشر", 13: "الثالث عشر", 14: "الرابع عشر",
    15: "الخامس عشر", 16: "السادس عشر", 17: "السابع عشر", 18: "الثامن عشر",
    19: "التاسع عشر", 20: "العشرون", 21: "الحادى والعشرون", 22: "الثانى والعشرون",
    23: "الثالث والعشرون", 24: "الرابع والعشرون", 25: "الخامس والعشرون",
    26: "السادس والعشرون", 27: "السابع والعشرون", 28: "الثامن والعشرون",
    29: "التاسع والعشرون", 30: "الثلاثون",
  };
  return "الجزء " + digits[num];
}

export function surahType(str) {
  return str.trim().toLowerCase() === "mec" ? "مكية" : "مدنية";
}

export function highlight(str, arr, className) {
  str = str.replace(/۞/g, `<span class="hizb">۞</span>`);
  let chunks = str.split(" ");
  let targetWords = [];
  chunks.forEach(word => {
    const normalWord = normalize(word);
    if (arr.indexOf(normalWord) !== -1) targetWords.push(word);
  });
  targetWords = [...new Set(targetWords)];
  targetWords.forEach(word => {
    str = str.replace(new RegExp(`${word}`, "g"), `<span class="${className}">${word}</span>`);
  });
  return str;
}

export function getFirstPage(part) {
  return +((part - 1) * 2 + "2");
}

export function getLastPage(part) {
  return getFirstPage(part) + 19;
}
