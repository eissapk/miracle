'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen, Volume2, Search, Bookmark, FileText,
  Star, Trophy, Hash, Moon, Sun, ChevronRight, ArrowLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { arNum } from '../services/filters';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';

const defaultLastRead = { juz: 1, page: 1, name: 'ٱلْفَاتِحَةِ', type: 'mec', surah: 1, verses: 7 };

const SURAHS_TICKER = [
  'الفاتحة','البقرة','آل عمران','النساء','المائدة','الأنعام','الأعراف','يوسف',
  'الكهف','مريم','طه','يس','الصافات','الرحمن','الواقعة','الحشر','الملك',
  'المزمل','المدثر','القيامة','الإنسان','الأعلى','الضحى','الشرح','التين',
  'العلق','القدر','الزلزلة','الإخلاص','الفلق','الناس',
];

const STEPS = [
  { num: '1', title: 'ابدأ من حيث توقفت', desc: 'يتذكر التطبيق تلقائياً آخر صفحة قرأتها، فتواصل رحلتك في أي وقت', Icon: BookOpen },
  { num: '2', title: 'اقرأ أو استمع',      desc: 'تمتع بقراءة القرآن بخط أنيق أو استمع لتلاوة نخبة من أفضل القراء', Icon: Volume2 },
  { num: '3', title: 'تابع إنجازاتك',     desc: 'سجّل ختماتك واحفظ مفضلتك وراقب تقدمك نحو ختم كلام الله', Icon: Trophy },
];

const FEATURES = [
  { title: 'قراءة القرآن',      desc: 'اقرأ كامل المصحف بخط مُتقَن مع تتبع تلقائي لآخر صفحة توقفت عندها',  Icon: BookOpen },
  { title: 'الاستماع للتلاوة', desc: 'استمع للآيات مع أفضل القراء وخيار التشغيل التلقائي للصفحات',           Icon: Volume2 },
  { title: 'البحث الذكي',      desc: 'ابحث عن أي آية أو كلمة في القرآن الكريم فوراً',                        Icon: Search },
  { title: 'الصفحات المفضلة', desc: 'احفظ الصفحات المفضلة وارجع إليها بضغطة واحدة',                          Icon: Bookmark },
  { title: 'التفسير والترجمة', desc: 'تفسير الميسر والجلالين وترجمة المعاني بنقرة واحدة',                     Icon: FileText },
  { title: 'الأذكار والأدعية', desc: 'أذكار الصباح والمساء ودعاء ختم القرآن الكريم',                          Icon: Star },
  { title: 'عداد التسبيح',     desc: 'عداد ذكي للتسبيح والذكر مع إمكانية ضبط الهدف اليومي',                  Icon: Hash },
  { title: 'تتبع الختمات',     desc: 'سجّل ختماتك واستعرض تاريخ إنجازاتك عبر الزمن',                         Icon: Trophy },
];

const RECITERS = [
  { key: 'mahermuaiqly', name: 'ماهر المعيقلى',     country: 'المملكة العربية السعودية', abbr: 'م م', c1: '#b5892a', c2: '#e8c060' },
  { key: 'ahmedajamy',   name: 'أحمد العجمى',       country: 'الكويت',                   abbr: 'أ ع', c1: '#6b3fa0', c2: '#a070e0' },
  { key: 'husary',       name: 'محمود خليل الحصرى', country: 'مصر',                      abbr: 'م ح', c1: '#1a7a50', c2: '#4ab87a' },
];

const FAQS = [
  { q: 'ما هو تطبيق معجزة؟',              a: 'معجزة تطبيق ويب حديث لقراءة القرآن الكريم، يجمع بين التصميم الأنيق وميزات الاستماع والتفسير والبحث والأذكار في مكان واحد.' },
  { q: 'هل أحتاج إلى الإنترنت للقراءة؟', a: 'بيانات القرآن الكريم (604 صفحة) مُدمجة كاملة في التطبيق ولا تحتاج اتصالاً للقراءة. الاستماع للتلاوة الصوتية فقط يتطلب اتصالاً بالشبكة.' },
  { q: 'كيف يتذكر التطبيق مكان قراءتي؟', a: 'يُحفظ موضع قراءتك تلقائياً في المتصفح مع كل صفحة تفتحها. يمكنك أيضاً حفظ أي صفحة في المفضلة للوصول إليها مباشرة.' },
  { q: 'ما هي القراء المتاحون في التطبيق؟', a: 'يتيح التطبيق الاستماع بصوت الشيخ ماهر المعيقلى والشيخ أحمد العجمى والشيخ محمود خليل الحصرى رحمه الله. يمكن تغيير القارئ من داخل صفحة القراءة.' },
  { q: 'كيف أسجّل ختمة في التطبيق؟',    a: 'عند الوصول للصفحة 604 يظهر زر "احفظ الختمة". بعد الحفظ يُعاد ضبط التقدم، ويمكنك مراجعة جميع ختماتك من قائمة "الختمات".' },
];

const PERKS = ['خط واضح ومتقن', 'استماع للتلاوة', 'تفسير وترجمة', 'بحث متقدم', 'وضع مظلم', 'حفظ المفضلة'];

/* gold gradient text — works on both light and dark backgrounds */
const GT = {
  background: 'linear-gradient(135deg,#c8952a 0%,#e8b85a 40%,#f0c060 60%,#c8952a 100%)',
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
};

/* ── PagePreview ── */
function PagePreview({ pageData, pageNum, dark = false, noScroll = false }) {
  if (!pageData) return null;
  const textColor = dark ? 'rgba(250,235,200,0.88)' : '#2a1a00';
  return (
    <div className={`h-full px-4 pt-3 pb-4 ${noScroll ? 'overflow-hidden' : 'overflow-y-auto scrollbar'}`} dir="rtl"
      style={{ background: dark ? '#100e08' : '#fdf8f0' }}>
      <div className="text-center mb-2">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-[10px] font-bold"
          style={{ background: 'linear-gradient(135deg,#c8952a,#f0c060)', fontFamily: 'Arial,sans-serif' }}>
          {arNum(pageNum)}
        </span>
      </div>
      {pageData.map((obj, i) => (
        <span key={i}>
          {obj.localVerse === 1 && (
            <div className="text-center mb-2">
              <span className="inline-block text-white text-[11px] font-bold rounded-full px-3 py-1"
                style={{ background: 'linear-gradient(to left,#c8952a,#e8b85a)' }}>
                {obj.name}
              </span>
            </div>
          )}
          {obj.localVerse === 1 && ![1, 9].includes(obj.surah) && (
            <div className="text-center text-[12px] mb-2 font-almushaf"
              style={{ background: 'linear-gradient(to left,#c8952a,#f0c060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ
            </div>
          )}
          <span className="font-kitab text-[17px] leading-[2.1]" style={{ color: textColor }}>{obj.text}</span>
          <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-white text-[8px] mx-[2px] align-middle"
            style={{ background: 'linear-gradient(135deg,#c8952a,#e8b85a)', fontFamily: 'Arial,sans-serif' }}>
            {arNum(obj.localVerse)}
          </span>
        </span>
      ))}
    </div>
  );
}

/* ── HomeMockup ── */
function HomeMockup() {
  return (
    <div className="h-full p-3 flex flex-col gap-2" style={{ background: 'linear-gradient(160deg,#fdf8f0 0%,#f0e4c0 100%)' }}>
      <div className="flex items-center gap-1.5 mb-1">
        <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#c8952a,#e8b85a)' }}>
          <BookOpen size={10} style={{ color: '#1a0f00' }} />
        </div>
        <span className="text-[10px] font-black" style={{ color: '#8b6914' }}>معجزة</span>
      </div>
      <div className="flex-1 rounded-xl p-2.5 flex flex-col justify-end mb-1"
        style={{ background: 'linear-gradient(to left,#b5832a,#d4a843)', boxShadow: '0 4px 12px rgba(180,130,40,0.3)' }}>
        <span className="text-white text-[8px] opacity-70 font-bold mb-0.5">آخر قراءة</span>
        <span className="text-white text-[11px] font-black font-kitab">سُورَةُ الفاتحة</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5 h-24">
        {[['بحث','rgba(212,168,67,0.15)'],['مفضلة','rgba(212,168,67,0.1)'],['اذكار','rgba(212,168,67,0.15)'],['تسبيح','rgba(212,168,67,0.1)']].map(([l, bg]) => (
          <div key={l} className="rounded-lg p-2 flex items-end" style={{ background: bg, border: '1px solid rgba(212,168,67,0.25)' }}>
            <span className="text-[9px] font-bold" style={{ color: '#8b6914' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── main ── */
export default function LandingPage() {
  const { isLoading, setModal, isDark, toggleDark } = useApp();
  const [lastRead, setLastRead] = useState(null);
  const [percent, setPercent] = useState(0);
  const [carouselPage, setCarouselPage] = useState(1);
  const [carouselData, setCarouselData] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('lastRead'));
    if (saved) { setLastRead(saved); setPercent(Math.floor((saved.page / 604) * 100)); }
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isLoading && window.pages) setCarouselData(window.pages[carouselPage]);
  }, [isLoading, carouselPage]);

  const goPrev = () => { if (carouselPage > 1) setCarouselPage(p => p - 1); };
  const goNext = () => { if (carouselPage < 604) setCarouselPage(p => p + 1); };
  const showModal = (name) => setModal({ name, data: null });

  const saveCompletion = () => {
    const arr = JSON.parse(localStorage.getItem('completion')) || [];
    arr.push({ id: Date.now(), time: new Date().toISOString() });
    localStorage.setItem('completion', JSON.stringify(arr));
    localStorage.setItem('lastRead', JSON.stringify(defaultLastRead));
    setLastRead(defaultLastRead);
    setPercent(0);
  };

  const displayRead = lastRead || defaultLastRead;
  const startPage = displayRead.page;
  const startName = displayRead.name;
  const tickerArr = [...SURAHS_TICKER, ...SURAHS_TICKER];

  /* ── theme ── */
  const D = isDark;
  const T = {
    bg:           D ? '#050505'                        : '#fdfaf5',
    bgAlt:        D ? '#080808'                        : '#f2e8d5',
    text:         D ? '#ffffff'                        : '#1a1006',
    muted:        D ? 'rgba(250,240,220,0.62)'        : 'rgba(40,20,0,0.55)',
    faint:        D ? 'rgba(250,240,220,0.62)'        : 'rgba(40,20,0,0.35)',
    vfaint:       D ? 'rgba(250,240,220,0.22)'        : 'rgba(40,20,0,0.22)',
    gold:         '#d4a843',
    goldAccent:   D ? '#d4a843'                        : '#8b5e00',
    card:         D ? 'rgba(212,168,67,0.055)'        : 'rgba(180,130,40,0.08)',
    cardBorder:   D ? 'rgba(212,168,67,0.15)'         : 'rgba(180,130,40,0.24)',
    heroBg:       D ? 'linear-gradient(160deg,#050505,#0a0700,#050505)' : 'linear-gradient(160deg,#fdfaf5,#f5e8cc,#fdfaf5)',
    heroText:     D ? '#ffffff'                        : '#1a1006',
    heroDot:      D ? 'rgba(212,168,67,0.12)'         : 'rgba(180,130,40,0.09)',
    heroGlow1:    D ? 'rgba(212,168,67,0.12)'         : 'rgba(212,168,67,0.18)',
    heroGlow2:    D ? 'rgba(160,100,20,0.09)'         : 'rgba(180,120,20,0.13)',
    tickerBg:     D ? '#0a0800'                        : '#e8dcc0',
    tickerBorder: D ? 'rgba(212,168,67,0.1)'          : 'rgba(180,130,40,0.2)',
    tickerName:   D ? 'rgba(212,168,67,0.72)'         : 'rgba(120,80,10,0.5)',
    tickerStar:   D ? 'rgba(212,168,67,0.35)'         : 'rgba(120,80,10,0.22)',
    headerBg:     D ? 'rgba(5,5,5,0.9)'               : 'rgba(253,250,245,0.95)',
    headerBorder: D ? 'rgba(212,168,67,0.1)'          : 'rgba(180,130,40,0.18)',
    footerBg:     D ? '#030303'                        : '#e8dcc0',
    footerBorder: D ? 'rgba(212,168,67,0.08)'         : 'rgba(180,130,40,0.18)',
    btnOutline:   D ? { border:'1px solid rgba(212,168,67,0.22)', color:'rgba(212,168,67,0.65)' }
                    : { border:'1px solid rgba(140,90,0,0.3)',    color:'rgba(120,75,0,0.75)' },
    progressBg:   D ? 'rgba(212,168,67,0.12)'         : 'rgba(180,130,40,0.12)',
    perkBg:       D ? 'rgba(212,168,67,0.04)'         : 'rgba(180,130,40,0.07)',
    perkBorder:   D ? 'rgba(212,168,67,0.1)'          : 'rgba(180,130,40,0.2)',
    perkText:     D ? 'rgba(250,240,220,0.78)'        : 'rgba(40,20,0,0.5)',
    scrollHint:   D ? 'rgba(212,168,67,0.22)'         : 'rgba(120,80,10,0.22)',
    stepNumBg:    D ? '#050505'                        : '#fdfaf5',
    stepNumBorder:D ? 'rgba(212,168,67,0.35)'         : 'rgba(180,130,40,0.35)',
    iconBg:       D ? 'rgba(212,168,67,0.09)'         : 'rgba(180,130,40,0.1)',
    iconBorder:   D ? 'rgba(212,168,67,0.2)'          : 'rgba(180,130,40,0.28)',
    largeCardBg:  D ? 'rgba(212,168,67,0.07)'         : 'rgba(180,130,40,0.06)',
    largeCardBorder:D?'rgba(212,168,67,0.2)'          : 'rgba(180,130,40,0.26)',
    largeCardLink:D ? { background:'rgba(212,168,67,0.1)',border:'1px solid rgba(212,168,67,0.28)',color:'#d4a843' }
                    : { background:'rgba(180,130,40,0.1)',border:'1px solid rgba(180,130,40,0.3)',color:'#7a5200' },
    ornament:     D ? 'rgba(212,168,67,0.55)'         : 'rgba(150,100,10,0.6)',
    ornamentLine: D ? 'rgba(212,168,67,0.3)'          : 'rgba(150,100,10,0.3)',
    reciterLink:  D ? { background:'rgba(212,168,67,0.08)',border:'1px solid rgba(212,168,67,0.2)',color:'#d4a843' }
                    : { background:'rgba(180,130,40,0.08)',border:'1px solid rgba(180,130,40,0.25)',color:'#7a5200' },
    mockupLabel:  D ? { background:'rgba(212,168,67,0.08)',border:'1px solid rgba(212,168,67,0.2)',color:'#d4a843' }
                    : { background:'rgba(180,130,40,0.1)',border:'1px solid rgba(180,130,40,0.25)',color:'#7a5200' },
    faqBorder:    D ? 'rgba(212,168,67,0.14)'         : 'rgba(180,130,40,0.22)',
    faqTrigger:   D ? 'text-white/80 hover:text-[#d4a843] hover:no-underline [&_svg]:text-[#d4a843]/60'
                    : 'text-[#1a1006]/80 hover:text-[#8b5e00] hover:no-underline [&_svg]:text-[#8b5e00]/60',
    faqContent:   D ? 'text-white/45'                 : 'text-[#1a1006]/55',
    quickBtn:     D ? 'text-white'                    : 'text-[#2a1500]',
    ctaBg:        D ? '#080808'                        : '#f2e8d5',
    ctaDot:       D ? 'rgba(212,168,67,0.045)'        : 'rgba(180,130,40,0.07)',
    ctaGlow:      D ? 'rgba(212,168,67,0.07)'         : 'rgba(180,130,40,0.1)',
    ctaText:      D ? '#ffffff'                        : '#1a1006',
    ctaMuted:     D ? 'rgba(250,240,220,0.38)'        : 'rgba(40,20,0,0.45)',
    ctaFine:      D ? 'rgba(212,168,67,0.6)'           : 'rgba(140,90,0,0.35)',
    footerText:   D ? 'rgba(250,240,220,0.52)'        : 'rgba(40,20,0,0.45)',
    footerGold:   D ? 'rgba(212,168,67,0.5)'          : 'rgba(140,90,0,0.45)',
    toggleBg:     D ? 'rgba(212,168,67,0.08)'         : 'rgba(180,130,40,0.1)',
    toggleBorder: D ? 'rgba(212,168,67,0.2)'          : 'rgba(180,130,40,0.28)',
    toggleColor:  D ? '#d4a843'                        : '#7a5200',
    navBtnBg:     D ? 'rgba(212,168,67,0.08)'         : 'rgba(180,130,40,0.08)',
    navBtnBorder: D ? '1px solid rgba(212,168,67,0.2)': '1px solid rgba(180,130,40,0.25)',
    navBtnColor:  D ? '#d4a843'                        : '#8b5e00',
    carouselNum:  D ? 'rgba(212,168,67,0.42)'         : 'rgba(120,80,10,0.5)',
  };

  const GC = { background: T.card, border: `1px solid ${T.cardBorder}` };

  const sectionA = { background: T.bg, color: T.text };
  const sectionB = { background: T.bgAlt, color: T.text };

  return (
    <div className="font-tajawal overflow-x-hidden" style={{ background: T.bg, color: T.text }}>

      {/* ══ HEADER ══ */}
      <header
        className="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
        style={scrolled ? { background: T.headerBg, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${T.headerBorder}`, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' } : {}}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* logo mark */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: 'linear-gradient(135deg,#c8952a,#e8b85a)', boxShadow: '0 2px 10px rgba(212,168,67,0.3)' }}>
              <BookOpen size={16} style={{ color: '#1a0f00' }} />
            </div>
            <span className="font-black text-lg" style={GT}>معجزة</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleDark}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
              style={{ background: T.toggleBg, border: `1px solid ${T.toggleBorder}`, color: T.toggleColor }}>
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <Link href={'/read/' + startPage}
              className="px-5 py-2 rounded-full text-sm font-bold no-underline transition-all"
              style={{ background: 'linear-gradient(to left,#c8952a,#e8b85a)', color: '#1a0f00', boxShadow: '0 4px 16px rgba(212,168,67,0.25)' }}>
              ابدأ القراءة
            </Link>
          </div>
        </div>
      </header>

      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden" style={{ background: T.heroBg }}>
        {/* dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle,${T.heroDot} 1px,transparent 1px)`,
          backgroundSize: '28px 28px',
        }} />
        {/* glow orbs */}
        <div className="absolute pointer-events-none" style={{
          top: '-10%', right: '-5%', width: '640px', height: '640px', borderRadius: '50%',
          background: `radial-gradient(circle at center,${T.heroGlow1} 0%,transparent 65%)`,
          animation: 'glow-pulse 9s ease-in-out infinite',
        }} />
        <div className="absolute pointer-events-none" style={{
          bottom: '-15%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%',
          background: `radial-gradient(circle at center,${T.heroGlow2} 0%,transparent 65%)`,
          animation: 'glow-pulse 12s ease-in-out infinite reverse',
        }} />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-20 flex flex-col lg:flex-row items-center gap-14">

          {/* text */}
          <div className="flex-1 text-center lg:text-right">
            <div className="inline-flex items-center gap-2 rounded-full mb-7 px-4 py-1.5 text-xs font-bold"
              style={{ background: T.perkBg, border: `1px solid ${T.perkBorder}`, color: T.goldAccent }}>
              <span style={{ fontSize: '9px' }}>✦</span>
              القرآن الكريم كاملاً في متناول يدك
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
              <span style={{ color: T.heroText }}>اقرأ القرآن</span>
              <br />
              <span style={GT} className='pt-2'>بتجربة لا مثيل لها</span>
            </h1>

            <p className="text-base mb-8 leading-relaxed max-w-md mx-auto lg:mx-0 lg:mr-auto" style={{ color: T.muted }}>
              تطبيق معجزة يُقدّم لك المصحف الشريف كاملاً بخط جميل واضح، مع استماع وتفسير وبحث وأذكار
            </p>

            {percent > 0 && (
              <div className="mb-7 rounded-2xl p-4 max-w-sm mx-auto lg:mx-0"
                style={{ background: T.perkBg, border: `1px solid ${T.perkBorder}` }}>
                <p className="text-xs font-bold mb-2" style={{ color: T.goldAccent }}>آخر قراءة — سورة {startName}</p>
                <div className="relative h-1 rounded-full overflow-hidden" style={{ background: T.progressBg }}>
                  <div className="absolute top-0 right-0 h-full rounded-full"
                    style={{ width: percent + '%', background: 'linear-gradient(to left,#c8952a,#f0c060)' }} />
                </div>
                <p className="text-xs mt-1" style={{ color: T.faint }}>{arNum(percent)}% مكتمل</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
              <Link href={'/read/' + startPage}
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-base no-underline transition-all"
                style={{ background: 'linear-gradient(to left,#c8952a,#e8b85a)', color: '#1a0f00', boxShadow: '0 8px 32px rgba(212,168,67,0.28)' }}>
                ابدأ القراءة الآن
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
              <Link href="/read/1"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm no-underline transition-all"
                style={T.btnOutline}>
                من البداية
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-2 justify-center lg:justify-start">
              {PERKS.map(p => (
                <span key={p} className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full"
                  style={{ background: T.perkBg, border: `1px solid ${T.perkBorder}`, color: T.perkText }}>
                  <span style={{ color: T.goldAccent, fontSize: '7px' }}>✦</span>
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* phone carousel */}
          <div className="flex-1 flex flex-col items-center">
            <div className="relative">
              <div className="absolute pointer-events-none" style={{
                inset: '-32px', borderRadius: '56px',
                background: `radial-gradient(ellipse at center,${T.heroGlow1} 0%,transparent 70%)`,
              }} />
              {/* phone body — always dark (hardware) */}
              <div className="relative w-[340px] h-[720px] sm:w-[380px] sm:h-[720px] animate-float"
                style={{
                  borderRadius: '44px',
                  background: 'linear-gradient(160deg,#2a2418,#1a1610)',
                  boxShadow: '0 0 0 1px rgba(212,168,67,0.22),inset 0 0 0 1px rgba(255,255,255,0.03),0 32px 80px rgba(0,0,0,0.5)',
                }}>
                <div className="absolute top-0 inset-x-8 h-px rounded-full"
                  style={{ background: 'linear-gradient(to right,transparent,rgba(212,168,67,0.45),transparent)' }} />
                <div className="absolute inset-[8px] rounded-[36px] overflow-hidden" style={{ background: '#fdf8f0' }}>
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 w-20 h-4 rounded-full" style={{ background: '#1a1610' }} />
                  <div className="h-full pt-5 overflow-hidden">
                    {isLoading ? (
                      <div className="h-full flex flex-col items-center justify-center gap-3">
                        <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
                          style={{ borderColor: 'rgba(212,168,67,0.15)', borderTopColor: '#d4a843' }} />
                        <p className="text-xs" style={{ color: 'rgba(180,130,40,0.5)' }}>جارى التحميل</p>
                      </div>
                    ) : (
                      <PagePreview pageData={carouselData} pageNum={carouselPage} noScroll />
                    )}
                  </div>
                </div>
                <div className="absolute top-20 -right-[4px] w-[4px] h-12 rounded-r-sm" style={{ background: '#2a2418' }} />
                <div className="absolute top-16 -left-[4px] w-[4px] h-8 rounded-l-sm" style={{ background: '#2a2418' }} />
                <div className="absolute top-28 -left-[4px] w-[4px] h-8 rounded-l-sm" style={{ background: '#2a2418' }} />
              </div>
            </div>

            <div className="flex items-center gap-5 mt-8">
              <button onClick={goNext} disabled={carouselPage >= 604}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-20"
                style={{ background: T.navBtnBg, border: T.navBtnBorder, color: T.navBtnColor }}>
                <ChevronRight size={16} />
              </button>
              <span className="text-sm tabular-nums" style={{ color: T.carouselNum }}>
                {arNum(carouselPage)} / 604
              </span>
              <button onClick={goPrev} disabled={carouselPage <= 1}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-20"
                style={{ background: T.navBtnBg, border: T.navBtnBorder, color: T.navBtnColor }}>
                <ChevronRight size={16} className="rotate-180" />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce" style={{ color: T.scrollHint }}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ══ MARQUEE ══ */}
      <div className="overflow-hidden py-3.5 border-y select-none" style={{ background: T.tickerBg, borderColor: T.tickerBorder }}>
        <div className="flex animate-marquee whitespace-nowrap" style={{ willChange: 'transform' }}>
          {tickerArr.map((name, i) => (
            <span key={i} className="inline-flex items-center">
              <span className="text-sm font-bold mx-5" style={{ color: T.tickerName }}>{name}</span>
              <span style={{ color: T.tickerStar, fontSize: '9px' }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ STATS ══ */}
      <section className="py-24" style={sectionB}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { value: '604', unit: 'صفحة', desc: 'من كلام الله المبارك' },
              { value: '114', unit: 'سورة', desc: 'في المصحف الشريف' },
              { value: '6236', unit: 'آية', desc: 'بيّنة مباركة مُنزَّلة' },
            ].map((s, i) => (
              <div key={i} className="text-center p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1 cursor-default" style={GC}>
                <div className="text-6xl font-black leading-none mb-2 tabular-nums" style={GT}>{s.value}</div>
                <div className="font-bold text-xl mb-2" style={{ color: T.text }}>{s.unit}</div>
                <div className="text-sm" style={{ color: T.faint }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="py-24" style={sectionA}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase mb-4 block" style={{ color: T.goldAccent, opacity: 0.7 }}>بسيط وسريع</span>
            <h2 className="text-4xl font-black mb-4"><span style={GT}>كيف يعمل التطبيق؟</span></h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: T.muted }}>ثلاث خطوات بسيطة تبدأ بها تجربتك مع القرآن الكريم</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-[56px] right-[calc(16.67%+28px)] left-[calc(16.67%+28px)] h-px"
              style={{ background: `linear-gradient(to left,${T.cardBorder},${T.perkBorder},${T.cardBorder})` }} />
            {STEPS.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1" style={GC}>
                <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: 'linear-gradient(135deg,#c8952a,#e8b85a)', boxShadow: '0 8px 24px rgba(212,168,67,0.28)' }}>
                  <step.Icon size={22} style={{ color: '#1a0f00' }} />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center"
                    style={{ background: T.stepNumBg, border: `2px solid ${T.cardBorder}`, color: T.goldAccent }}>
                    {step.num}
                  </span>
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: T.text }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: T.muted }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES BENTO ══ */}
      <section className="py-24" style={sectionB}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-widest uppercase mb-4 block" style={{ color: T.goldAccent, opacity: 0.7 }}>مميزات شاملة</span>
            <h2 className="text-4xl font-black mb-3"><span style={GT}>كل ما تحتاجه في مكان واحد</span></h2>
            <p className="text-sm" style={{ color: T.muted }}>تجربة قرآنية متكاملة بين يديك</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Large hero card */}
            <div className="lg:col-span-2 lg:row-span-2 rounded-3xl p-8 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[260px] lg:min-h-0"
              style={{ background: T.largeCardBg, border: `1px solid ${T.largeCardBorder}` }}>
              <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-3xl"
                style={{ background: 'linear-gradient(to right,transparent,#c8952a,#e8b85a,#c8952a,transparent)' }} />
              <div className="absolute -bottom-4 -left-4 pointer-events-none" style={{ opacity: D ? 0.035 : 0.06 }}>
                <BookOpen size={200} style={{ color: '#d4a843' }} />
              </div>
              <div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: 'linear-gradient(135deg,#c8952a,#e8b85a)', boxShadow: '0 8px 24px rgba(212,168,67,0.28)' }}>
                  <BookOpen size={24} style={{ color: '#1a0f00' }} />
                </div>
                <h3 className="font-black text-2xl mb-3" style={{ color: T.text }}>قراءة القرآن الكريم</h3>
                <p className="text-sm leading-relaxed" style={{ color: T.muted }}>
                  اقرأ كامل المصحف الشريف بخط مُتقَن جميل مع تتبع تلقائي لآخر صفحة توقفت عندها
                </p>
              </div>
              <Link href={'/read/' + startPage}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold no-underline w-fit transition-all"
                style={T.largeCardLink}>
                اقرأ الآن <ArrowLeft size={13} />
              </Link>
            </div>

            {FEATURES.slice(1).map((feat, i) => (
              <div key={i} className="rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1" style={GC}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: T.iconBg, border: `1px solid ${T.iconBorder}` }}>
                  <feat.Icon size={18} style={{ color: T.goldAccent }} />
                </div>
                <h3 className="font-bold text-sm mb-1.5" style={{ color: T.text }}>{feat.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: T.muted }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VERSE SPOTLIGHT — always dark for drama ══ */}
      <section className="py-32 relative overflow-hidden" style={{ background: D ? '#050505' : '#1a0e00' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle,rgba(212,168,67,0.06) 1px,transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 55% 50% at 50% 50%,rgba(212,168,67,0.1) 0%,transparent 100%)',
        }} />

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px flex-1 max-w-[90px]" style={{ background: 'linear-gradient(to left,transparent,rgba(212,168,67,0.3))' }} />
            <span style={{ color: 'rgba(212,168,67,0.6)', fontSize: '18px' }}>✦</span>
            <div className="h-px flex-1 max-w-[90px]" style={{ background: 'linear-gradient(to right,transparent,rgba(212,168,67,0.3))' }} />
          </div>

          <span className="text-xs font-bold tracking-widest uppercase mb-10 block" style={{ color: '#d4a843', opacity: 0.7 }}>من كلام الله تعالى</span>

          <div className="relative inline-block px-10 py-12 sm:px-16 sm:py-14">
            <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2" style={{ borderColor: 'rgba(212,168,67,0.38)', borderTopRightRadius: '10px' }} />
            <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2" style={{ borderColor: 'rgba(212,168,67,0.38)', borderTopLeftRadius: '10px' }} />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2" style={{ borderColor: 'rgba(212,168,67,0.38)', borderBottomRightRadius: '10px' }} />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2" style={{ borderColor: 'rgba(212,168,67,0.38)', borderBottomLeftRadius: '10px' }} />
            <p className="font-almushaf leading-loose"
              style={{
                fontSize: 'clamp(2rem,6vw,3.4rem)',
                background: 'linear-gradient(135deg,#a07020 0%,#e8b850 30%,#fefce8 50%,#e8b850 70%,#a07020 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                filter: 'drop-shadow(0 0 28px rgba(212,168,67,0.22))',
              }}>
              ٱقۡرَأۡ بِٱسۡمِ رَبِّكَ ٱلَّذِى خَلَقَ
            </p>
          </div>

          <p className="mt-6 text-sm" style={{ color: 'rgba(250,240,220,0.38)' }}>اقرأ باسم ربك الذي خلق</p>
          <p className="mt-1 text-xs" style={{ color: 'rgba(250,240,220,0.5)' }}>سورة العلق — أول آية أُنزلت من القرآن الكريم</p>

          <div className="flex items-center justify-center gap-4 mt-10">
            <div className="h-px flex-1 max-w-[90px]" style={{ background: 'linear-gradient(to left,transparent,rgba(212,168,67,0.3))' }} />
            <span style={{ color: 'rgba(212,168,67,0.6)', fontSize: '18px' }}>✦</span>
            <div className="h-px flex-1 max-w-[90px]" style={{ background: 'linear-gradient(to right,transparent,rgba(212,168,67,0.3))' }} />
          </div>
        </div>
      </section>

      {/* ══ RECITERS ══ */}
      <section className="py-24" style={sectionA}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-widest uppercase mb-4 block" style={{ color: T.goldAccent, opacity: 0.7 }}>نخبة من القراء</span>
            <h2 className="text-4xl font-black mb-3"><span style={GT}>استمع لأفضل القراء</span></h2>
            <p className="text-sm" style={{ color: T.muted }}>اختر القارئ المفضل لديك من بين نخبة من العلماء والمقرئين</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {RECITERS.map(r => (
              <div key={r.key} className="rounded-3xl p-8 text-center transition-all duration-300 hover:-translate-y-1 relative overflow-hidden" style={GC}>
                <div className="absolute top-0 inset-x-0 h-[2px]"
                  style={{ background: `linear-gradient(to right,transparent,${r.c1},${r.c2},${r.c1},transparent)`, opacity: 0.6 }} />
                <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center text-xl font-black"
                  style={{ background: `linear-gradient(135deg,${r.c1},${r.c2})`, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', color: '#fff' }}>
                  {r.abbr}
                </div>
                <h3 className="font-bold mb-1" style={{ color: T.text }}>{r.name}</h3>
                <p className="text-xs mb-5" style={{ color: T.faint }}>{r.country}</p>
                <Link href={'/read/' + startPage}
                  className="inline-flex items-center gap-1.5 text-xs font-bold no-underline px-4 py-2 rounded-full transition-all"
                  style={T.reciterLink}>
                  <Volume2 size={11} />
                  استمع الآن
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ APP MOCKUPS ══ */}
      <section className="py-24" style={sectionB}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-widest uppercase mb-4 block" style={{ color: T.goldAccent, opacity: 0.7 }}>تصميم أنيق</span>
            <h2 className="text-4xl font-black mb-3"><span style={GT}>تصميم يناسب ذوقك</span></h2>
            <p className="text-sm" style={{ color: T.muted }}>وضع فاتح لراحة العين نهاراً، ووضع مظلم أنيق لقراءة الليل</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16">
            <div className="relative">
              <div className="absolute pointer-events-none" style={{ inset: '-24px', borderRadius: '44px', background: `radial-gradient(ellipse at center,${T.heroGlow1} 0%,transparent 70%)` }} />
              <div className="relative w-[200px] h-[420px] rounded-[38px] overflow-hidden"
                style={{ background: 'linear-gradient(160deg,#2a2418,#1a1610)', boxShadow: '0 0 0 1px rgba(212,168,67,0.2),0 24px 60px rgba(0,0,0,0.3)' }}>
                <div className="absolute inset-[7px] rounded-[30px] overflow-hidden">
                  <HomeMockup />
                </div>
              </div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-bold"
                style={T.mockupLabel}>
                الوضع الفاتح
              </div>
            </div>

            <div className="relative">
              <div className="absolute pointer-events-none" style={{ inset: '-24px', borderRadius: '44px', background: `radial-gradient(ellipse at center,${T.heroGlow2} 0%,transparent 70%)` }} />
              <div className="relative w-[200px] h-[420px] rounded-[38px] overflow-hidden"
                style={{ background: 'linear-gradient(160deg,#2a2418,#1a1610)', boxShadow: '0 0 0 1px rgba(212,168,67,0.15),0 24px 60px rgba(0,0,0,0.3)' }}>
                <div className="absolute inset-[7px] rounded-[30px] overflow-hidden">
                  {isLoading ? (
                    <div className="h-full flex items-center justify-center" style={{ background: '#100e08' }}>
                      <div className="w-8 h-8 rounded-full border-4 animate-spin"
                        style={{ borderColor: 'rgba(212,168,67,0.15)', borderTopColor: '#d4a843' }} />
                    </div>
                  ) : (
                    <PagePreview pageData={window.pages?.[1]} pageNum={1} dark={true} />
                  )}
                </div>
              </div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-bold"
                style={T.mockupLabel}>
                الوضع المظلم
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ QUICK ACCESS ══ */}
      <section className="py-20" style={sectionA}>
        <div className="max-w-lg mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black mb-2"><span style={GT}>استكشف التطبيق</span></h2>
            <p className="text-sm" style={{ color: T.muted }}>وصول سريع لجميع مميزات التطبيق</p>
          </div>
          <div className="grid gap-3 select-none">
            <div className="relative rounded-3xl overflow-hidden p-6"
              style={{ background: 'linear-gradient(to left,#9a6f1e,#c8952a,#e8b85a)', boxShadow: '0 8px 32px rgba(212,168,67,0.2)' }}>
              <Link href={'/read/' + startPage} className="absolute inset-0 z-10" />
              <div className="relative">
                <p className="text-xs font-bold mb-1" style={{ color: 'rgba(5,5,5,0.55)' }}>آخر قراءة</p>
                <p className="text-xl font-black font-kitab mb-4" style={{ color: '#1a0f00' }}>سُورَةُ {startName}</p>
                <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.18)' }}>
                  <div className="absolute top-0 right-0 h-full rounded-full bg-white" style={{ width: percent + '%' }} />
                </div>
                <p className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.38)' }}>{arNum(percent)}%</p>
              </div>
              {percent === 100 && (
                <button onClick={(e) => { e.preventDefault(); saveCompletion(); }}
                  className="relative z-20 mt-3 inline-block px-4 py-1.5 text-xs font-bold rounded-full transition-all"
                  style={{ background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(0,0,0,0.28)', color: '#1a0f00' }}>
                  احفظ الختمة
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[{ label: 'بحث', action: 'search' }, { label: 'المفضلة', action: 'bookmarks' }].map(b => (
                <button key={b.label} onClick={() => showModal(b.action)}
                  className={`rounded-3xl py-5 px-4 font-bold text-center transition-all active:scale-95 ${T.quickBtn}`}
                  style={GC}>
                  {b.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[{ label: 'اذكار', action: 'azkar' }, { label: 'تسبيح', action: 'tasbih' }].map(b => (
                <button key={b.label} onClick={() => showModal(b.action)}
                  className={`rounded-3xl py-5 px-4 font-bold text-center transition-all active:scale-95 ${T.quickBtn}`}
                  style={GC}>
                  {b.label}
                </button>
              ))}
            </div>

            <button onClick={() => showModal('doaa')}
              className={`w-full rounded-3xl py-5 font-bold text-center transition-all active:scale-95 ${T.quickBtn}`}
              style={GC}>
              دعاء ختم القرآن
            </button>
            <button onClick={() => showModal('completion')}
              className={`w-full rounded-3xl py-5 font-bold text-center transition-all active:scale-95 ${T.quickBtn}`}
              style={GC}>
              الختمات
            </button>
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="py-24" style={sectionB}>
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase mb-4 block" style={{ color: T.goldAccent, opacity: 0.7 }}>أسئلة وأجوبة</span>
            <h2 className="text-4xl font-black mb-3"><span style={GT}>أسئلة شائعة</span></h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} style={{ borderColor: T.faqBorder }}>
                <AccordionTrigger className={T.faqTrigger}>{faq.q}</AccordionTrigger>
                <AccordionContent className={T.faqContent}>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="py-32 relative overflow-hidden" style={{ background: T.ctaBg, color: T.ctaText }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle,${T.ctaDot} 1px,transparent 1px)`,
          backgroundSize: '28px 28px',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 50% 60% at 50% 50%,${T.ctaGlow} 0%,transparent 100%)`,
        }} />
        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-16" style={{ background: T.cardBorder }} />
            <span style={{ color: T.goldAccent, fontSize: '16px', opacity: 0.7 }}>✦</span>
            <div className="h-px w-16" style={{ background: T.cardBorder }} />
          </div>

          <h2 className="text-5xl font-black mb-6 leading-tight">
            <span style={{ color: T.ctaText }}>ابدأ رحلتك مع</span>
            <br />
            <span style={GT}>القرآن الكريم اليوم</span>
          </h2>

          <p className="mb-10 max-w-md mx-auto" style={{ color: T.ctaMuted }}>
            انضم لآلاف القراء واستمتع بتجربة قراءة القرآن الكريم بأجمل التصاميم وأفضل الميزات
          </p>

          <Link href={'/read/' + startPage}
            className="group inline-flex items-center gap-3 px-10 py-4 rounded-full font-black text-lg no-underline transition-all"
            style={{ background: 'linear-gradient(to left,#c8952a,#e8b85a)', color: '#1a0f00', boxShadow: '0 12px 40px rgba(212,168,67,0.3)' }}>
            ابدأ القراءة الآن
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </Link>

          <p className="mt-5 text-xs" style={{ color: T.ctaFine }}>مجاني تماماً · لا تسجيل مطلوب · يعمل في المتصفح مباشرة</p>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="py-10 border-t" style={{ background: T.footerBg, borderColor: T.footerBorder }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center opacity-80"
                style={{ background: 'linear-gradient(135deg,#c8952a,#e8b85a)' }}>
                <BookOpen size={14} style={{ color: '#1a0f00' }} />
              </div>
              <div>
                <p className="font-black text-sm" style={GT}>معجزة</p>
                <p className="text-xs" style={{ color: T.footerText }}>تطبيق القرآن الكريم</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {[
                { label: 'قراءة', fn: () => {} },
                { label: 'بحث', fn: () => showModal('search') },
                { label: 'اذكار', fn: () => showModal('azkar') },
                { label: 'تسبيح', fn: () => showModal('tasbih') },
              ].map(item => (
                <button key={item.label} onClick={item.fn}
                  className="text-xs bg-transparent border-0 cursor-pointer transition-colors"
                  style={{ color: T.footerText }}
                  onMouseEnter={e => e.currentTarget.style.color = T.goldAccent}
                  onMouseLeave={e => e.currentTarget.style.color = T.footerText}>
                  {item.label}
                </button>
              ))}
            </div>
            <p className="text-xs" style={{ color: T.footerGold }}>تطبيق معجزة — القرآن الكريم</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
