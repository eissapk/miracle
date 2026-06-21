'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  BookOpen, Volume2, Search, Bookmark, FileText,
  Star, Trophy, Hash, Moon, Sun, ChevronRight, ArrowLeft,
  Languages, Palette,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { arNum } from '../services/filters';
import { getQuranUrl } from '../services/pageIndex';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';
import { Input } from '../components/ui/input';

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

const TAFSEERS = [
  {
    key: 'muyassar',
    Icon: FileText,
    title: 'تفسير الميسر',
    author: 'نخبة من علماء المملكة العربية السعودية',
    desc: 'تفسير سهل مُيسَّر يُعنى بتوضيح المعاني بأسلوب واضح ومختصر يناسب القارئ المعاصر',
    sample: 'اقرأ -أيها النبي- ما أُنزل إليك من القرآن مُفْتَتِحًا باسم ربك المتفرد بالخلق، الذي خلق كل إنسان من قطعة دم غليظ أحمر. اقرأ -أيها النبي- ما أُنزل إليك، وإن ربك لكثير الإحسان واسع الجود، الذي علَّم خلقه الكتابة بالقلم، علَّم الإنسان ما لم يكن يعلم، ونقله من ظلمة الجهل إلى نور العلم.',
  },
  {
    key: 'jalalayn',
    Icon: BookOpen,
    title: 'تفسير الجلالين',
    author: 'جلال الدين المحلي · جلال الدين السيوطي',
    desc: 'من أشهر التفاسير الكلاسيكية، يتميز بالإيجاز والدقة في الشرح اللغوي والبياني للآيات',
    sample: '«اقرأ» أوجد القراءة مبتدئا «باسم ربك الذي خلق» الخلائق.',
  },
];

const ALL_FEATURES = [
  { Icon: Bookmark,   title: 'الصفحات المفضلة',     desc: 'احفظ صفحاتك المفضلة وارجع إليها بضغطة واحدة' },
  { Icon: Star,       title: 'أذكار الصباح والمساء', desc: 'أذكار مصنّفة لكل وقت وحال بصيغة أنيقة' },
  { Icon: Hash,       title: 'عداد التسبيح',         desc: 'عدّ تسبيحك مع إمكانية ضبط الهدف اليومي' },
  { Icon: FileText,   title: 'دعاء ختم القرآن',      desc: 'دعاء الختم كاملاً يُفتح بضغطة واحدة' },
  { Icon: Trophy,     title: 'تتبع الختمات',         desc: 'سجّل ختماتك واستعرض تاريخ إنجازاتك' },
  { Icon: Search,     title: 'البحث الذكي',          desc: 'ابحث في أي آية أو كلمة في القرآن فوراً' },
  { Icon: Volume2,    title: 'الاستماع للتلاوة',     desc: 'استمع للآيات بصوت أفضل القراء' },
  { Icon: Moon,       title: 'الوضع المظلم',         desc: 'اختر بين الوضع الفاتح والمظلم براحة تامة' },
  { Icon: BookOpen,   title: 'تفسير القرآن الكريم',  desc: 'تفسيرا الميسر والجلالين في متناول يدك' },
  { Icon: Languages,  title: 'ترجمة معاني القرآن',   desc: 'ترجمة إنجليزية للمعاني بنقرة على أي آية' },
  { Icon: Palette,    title: 'تلوين الآيات',          desc: 'لوّن الآيات بألوان مختلفة وضع علاماتك' },
  { Icon: ChevronRight, title: 'التنقل بالإيماءات',  desc: 'انتقل بين الصفحات بسحب سلس ويسير' },
];

const FAQS = [
  { q: 'ما هو تطبيق معجزة؟',              a: 'معجزة تطبيق ويب حديث لقراءة القرآن الكريم، يجمع بين التصميم الأنيق وميزات الاستماع والتفسير والبحث والأذكار في مكان واحد.' },
  { q: 'هل أحتاج إلى الإنترنت للقراءة؟', a: 'بيانات القرآن الكريم (604 صفحة) مُدمجة كاملة في التطبيق ولا تحتاج اتصالاً للقراءة. الاستماع للتلاوة الصوتية فقط يتطلب اتصالاً بالشبكة.' },
  { q: 'كيف يتذكر التطبيق مكان قراءتي؟', a: 'يُحفظ موضع قراءتك تلقائياً في المتصفح مع كل صفحة تفتحها. يمكنك أيضاً حفظ أي صفحة في المفضلة للوصول إليها مباشرة.' },
  { q: 'ما هي القراء المتاحون في التطبيق؟', a: 'يتيح التطبيق الاستماع بصوت الشيخ ماهر المعيقلى والشيخ أحمد العجمى والشيخ محمود خليل الحصرى رحمه الله. يمكن تغيير القارئ من داخل صفحة القراءة.' },
  { q: 'كيف أسجّل ختمة في التطبيق؟',    a: 'عند الوصول للصفحة 604 يظهر زر "احفظ الختمة". بعد الحفظ يُعاد ضبط التقدم، ويمكنك مراجعة جميع ختماتك من قائمة "الختمات".' },
];

const PERKS = ['خط واضح ومتقن', 'استماع للتلاوة', 'تفسير وترجمة', 'بحث متقدم', 'وضع مظلم', 'حفظ المفضلة'];

const HERO_QUICK_LINKS = [
  ['اذكار',     'azkar',      Star],
  ['تسبيح',    'tasbih',     Hash],
  ['المفضلة',  'bookmarks',  Bookmark],
  ['دعاء الختم','doaa',      FileText],
  ['الختمات',  'completion', Trophy],
];

/* gold gradient text — same in both modes */
const GT = {
  background: 'linear-gradient(135deg,#c8952a 0%,#e8b85a 40%,#f0c060 60%,#c8952a 100%)',
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
};

/* shared card style */
const GC = { background: 'var(--lp-card-bg)', border: '1px solid var(--lp-card-border)' };
const sectionA = { background: 'var(--lp-bg)', color: 'var(--lp-text)' };
const sectionB = { background: 'var(--lp-bg-alt)', color: 'var(--lp-text)' };

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
    <div className="h-full flex flex-col" style={{ background: 'linear-gradient(160deg,#fdf8f0 0%,#f0e4c0 100%)' }}>
      {/* notch */}
      <div className="flex-shrink-0 h-5 flex items-end justify-center pb-0.5">
        <div className="w-16 h-3 rounded-full" style={{ background: '#1a1610' }} />
      </div>
      {/* header */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-2">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#c8952a,#e8b85a)' }}>
          <BookOpen size={10} style={{ color: '#1a0f00' }} />
        </div>
        <span className="text-[11px] font-black" style={{ color: '#8b6914' }}>معجزة</span>
        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(180,130,40,0.12)' }}>
          <Moon size={9} style={{ color: '#8b6914' }} />
        </div>
      </div>
      {/* last read card */}
      <div className="mx-3 mb-2 rounded-xl p-2.5"
        style={{ background: 'linear-gradient(to left,#b5832a,#d4a843)', boxShadow: '0 4px 12px rgba(180,130,40,0.3)' }}>
        <span className="text-white text-[7px] opacity-70 font-bold block mb-0.5">آخر قراءة</span>
        <span className="text-white text-[10px] font-black font-kitab block leading-tight">سُورَةُ البقرة</span>
        <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.25)' }}>
          <div className="h-full rounded-full bg-white" style={{ width: '28%' }} />
        </div>
        <span className="text-white text-[7px] opacity-60 mt-0.5 block">٢٨٪ مكتمل</span>
      </div>
      {/* stats */}
      <div className="mx-3 mb-2 grid grid-cols-3 gap-1.5">
        {[['٦٠٤','صفحة'],['١١٤','سورة'],['٦٢٣٦','آية']].map(([v, l]) => (
          <div key={l} className="rounded-lg p-1.5 text-center" style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)' }}>
            <div className="text-[9px] font-black" style={{ color: '#8b6914' }}>{v}</div>
            <div className="text-[7px]" style={{ color: 'rgba(139,105,20,0.6)' }}>{l}</div>
          </div>
        ))}
      </div>
      {/* feature grid */}
      <div className="mx-3 grid grid-cols-2 gap-1.5 flex-1 pb-3">
        {[['بحث','rgba(212,168,67,0.12)'],['مفضلة','rgba(212,168,67,0.08)'],['اذكار','rgba(212,168,67,0.12)'],['تسبيح','rgba(212,168,67,0.08)']].map(([l, bg]) => (
          <div key={l} className="rounded-lg p-2 flex items-end" style={{ background: bg, border: '1px solid rgba(212,168,67,0.2)' }}>
            <span className="text-[9px] font-bold" style={{ color: '#8b6914' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── main ── */
export default function LandingPage() {
  const { isLoading, setModal, toggleDark, isDark } = useApp();
  const [lastRead, setLastRead] = useState(null);
  const [percent, setPercent] = useState(0);
  const [carouselPage, setCarouselPage] = useState(1);
  const [carouselData, setCarouselData] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [inputPage, setInputPage] = useState('1');

  const phoneRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0 });
  const carouselPageRef = useRef(1);
  const navigateRef = useRef({ next: () => {}, prev: () => {} });
  const inputTimerRef = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('lastRead'));
    if (saved) {
      setLastRead(saved);
      setPercent(Math.floor((saved.page / 604) * 100));
      setCarouselPage(saved.page);
      setInputPage(String(saved.page));
    }
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isLoading && window.pages) setCarouselData(window.pages[carouselPage]);
  }, [isLoading, carouselPage]);

  /* keep refs in sync */
  useEffect(() => { carouselPageRef.current = carouselPage; }, [carouselPage]);

  /* drag-to-slide on the phone */
  useEffect(() => {
    const phone = phoneRef.current;
    if (!phone) return;
    const getContent = () => phone.querySelector('[data-phone-content]');

    const slideOut = (content, dir, onDone) => {
      const w = phone.offsetWidth;
      content.style.transition = 'transform 0.22s ease-in';
      content.style.transform = `translateX(${dir * w}px)`;
      setTimeout(() => {
        onDone();
        content.style.transition = 'none';
        content.style.transform = `translateX(${-dir * w}px)`;
        requestAnimationFrame(() => requestAnimationFrame(() => {
          content.style.transition = 'transform 0.3s cubic-bezier(0.16,1,0.3,1)';
          content.style.transform = '';
        }));
      }, 220);
    };

    const start = (x) => {
      dragRef.current = { active: true, startX: x };
      const c = getContent();
      if (c) c.style.transition = 'none';
      phone.style.cursor = 'grabbing';
    };

    const move = (x) => {
      if (!dragRef.current.active) return;
      const dx = x - dragRef.current.startX;
      const c = getContent();
      if (c) c.style.transform = `translateX(${dx * 0.45}px)`;
    };

    const end = (x) => {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;
      phone.style.cursor = '';
      const dx = x - dragRef.current.startX;
      const c = getContent();
      const threshold = phone.offsetWidth * 0.22;

      if (dx > threshold && carouselPageRef.current < 604) {
        slideOut(c, 1, () => navigateRef.current.next());
      } else if (dx < -threshold && carouselPageRef.current > 1) {
        slideOut(c, -1, () => navigateRef.current.prev());
      } else {
        if (c) {
          c.style.transition = 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)';
          c.style.transform = '';
        }
      }
    };

    const onMouseDown = (e) => { e.preventDefault(); start(e.clientX); };
    const onMouseMove = (e) => move(e.clientX);
    const onMouseUp   = (e) => end(e.clientX);
    const onTouchStart = (e) => start(e.touches[0].clientX);
    const onTouchMove  = (e) => { e.preventDefault(); move(e.touches[0].clientX); };
    const onTouchEnd   = (e) => end(e.changedTouches[0].clientX);

    phone.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    phone.addEventListener('touchstart', onTouchStart, { passive: true });
    phone.addEventListener('touchmove', onTouchMove, { passive: false });
    phone.addEventListener('touchend', onTouchEnd);
    return () => {
      phone.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      phone.removeEventListener('touchstart', onTouchStart);
      phone.removeEventListener('touchmove', onTouchMove);
      phone.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const updateCarouselPage = (newPage) => {
    if (newPage < 1 || newPage > 604) return;
    setCarouselPage(newPage);
    setInputPage(String(newPage));
    if (window.pages && window.pages[newPage]) {
      const firstObj = window.pages[newPage][0];
      const newLastRead = { juz: firstObj.juz, page: firstObj.page, name: firstObj.name, type: firstObj.type, surah: firstObj.surah, verses: firstObj.verses };
      localStorage.setItem('lastRead', JSON.stringify(newLastRead));
      setLastRead(newLastRead);
    } else {
      const newLastRead = { ...(lastRead || defaultLastRead), page: newPage };
      localStorage.setItem('lastRead', JSON.stringify(newLastRead));
      setLastRead(newLastRead);
    }
    setPercent(Math.floor((newPage / 604) * 100));
  };

  const handlePageInputChange = (e) => {
    const val = e.target.value;
    setInputPage(val);
    clearTimeout(inputTimerRef.current);
    inputTimerRef.current = setTimeout(() => {
      const num = parseInt(val, 10);
      if (!isNaN(num) && num >= 1 && num <= 604) updateCarouselPage(num);
    }, 350);
  };

  const handlePageInputBlur = () => {
    const num = parseInt(inputPage, 10);
    if (isNaN(num) || num < 1 || num > 604) setInputPage(String(carouselPage));
  };

  const goPrev = () => { if (carouselPage > 1) updateCarouselPage(carouselPage - 1); };
  const goNext = () => { if (carouselPage < 604) updateCarouselPage(carouselPage + 1); };

  /* keep navigateRef fresh every render */
  navigateRef.current = { next: goNext, prev: goPrev };
  const showModal = (name) => setModal({ name, data: null });

  const displayRead = lastRead || defaultLastRead;
  const startPage = displayRead.page;
  const startName = displayRead.name;
  const tickerArr = [...SURAHS_TICKER, ...SURAHS_TICKER];

  return (
    <div className="font-tajawal overflow-x-hidden" style={{ background: 'var(--lp-bg)', color: 'var(--lp-text)' }}>

      {/* ══ HEADER ══ */}
      <header
        className="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
        style={scrolled ? { background: 'var(--lp-header-bg)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--lp-header-border)', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' } : {}}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
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
              style={{ background: 'var(--lp-toggle-bg)', border: '1px solid var(--lp-toggle-border)', color: 'var(--lp-toggle-color)' }}>
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <Link href={getQuranUrl(startPage)}
              className="px-5 py-2 rounded-full text-sm font-bold no-underline transition-all"
              style={{ background: 'linear-gradient(to left,#c8952a,#e8b85a)', color: '#1a0f00', boxShadow: '0 4px 16px rgba(212,168,67,0.25)' }}>
              ابدأ القراءة
            </Link>
          </div>
        </div>
      </header>

      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden" style={{ background: 'var(--lp-hero-bg)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle,var(--lp-dot) 1px,transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="absolute pointer-events-none" style={{
          top: '-10%', right: '-5%', width: '640px', height: '640px', borderRadius: '50%',
          background: 'radial-gradient(circle at center,var(--lp-glow1) 0%,transparent 65%)',
          animation: 'glow-pulse 9s ease-in-out infinite',
        }} />
        <div className="absolute pointer-events-none" style={{
          bottom: '-15%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle at center,var(--lp-glow2) 0%,transparent 65%)',
          animation: 'glow-pulse 12s ease-in-out infinite reverse',
        }} />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-20 flex flex-col lg:flex-row items-center gap-14">

          {/* text */}
          <div className="flex-1 text-center lg:text-right">
            <div className="inline-flex items-center gap-2 rounded-full mb-7 px-4 py-1.5 text-xs font-bold"
              style={{ background: 'var(--lp-perk-bg)', border: '1px solid var(--lp-perk-border)', color: 'var(--lp-gold-accent)' }}>
              <span style={{ fontSize: '9px' }}>✦</span>
              القرآن الكريم كاملاً في متناول يدك
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
              <span style={{ color: 'var(--lp-text)' }}>اقرأ القرآن</span>
              <br />
              <span style={GT} className='pt-2'>بتجربة لا مثيل لها</span>
            </h1>

            <p className="text-base mb-8 leading-relaxed max-w-md mx-auto lg:mx-0" style={{ color: 'var(--lp-muted)' }}>
              تطبيق معجزة يُقدّم لك المصحف الشريف كاملاً بخط جميل واضح، مع استماع وتفسير وبحث وأذكار
            </p>

            {percent > 0 && (
              <div className="mb-7 rounded-2xl p-4 max-w-sm mx-auto lg:mx-0"
                style={{ background: 'var(--lp-perk-bg)', border: '1px solid var(--lp-perk-border)' }}>
                <p className="text-xs font-bold mb-2" style={{ color: 'var(--lp-gold-accent)' }}>آخر قراءة — سورة {startName}</p>
                <div className="relative h-1 rounded-full overflow-hidden" style={{ background: 'var(--lp-progress-bg)' }}>
                  <div className="absolute top-0 right-0 h-full rounded-full"
                    style={{ width: percent + '%', background: 'linear-gradient(to left,#c8952a,#f0c060)' }} />
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--lp-faint)' }}>{arNum(percent)}% مكتمل</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
              <Link href={getQuranUrl(startPage)}
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-base no-underline transition-all"
                style={{ background: 'linear-gradient(to left,#c8952a,#e8b85a)', color: '#1a0f00', boxShadow: '0 8px 32px rgba(212,168,67,0.28)' }}>
                ابدأ القراءة الآن
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
              <Link href="/quran/al-fatiha/1"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm no-underline transition-all"
                style={{ border: '1px solid var(--lp-btn-outline-border)', color: 'var(--lp-btn-outline-color)' }}>
                من البداية
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-2 justify-center lg:justify-start">
              {PERKS.map(p => (
                <span key={p} className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full"
                  style={{ background: 'var(--lp-perk-bg)', border: '1px solid var(--lp-perk-border)', color: 'var(--lp-perk-text)' }}>
                  <span style={{ color: 'var(--lp-gold-accent)', fontSize: '7px' }}>✦</span>
                  {p}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 justify-center lg:justify-start">
              {HERO_QUICK_LINKS.map(([label, modal, Icon]) => (
                <button key={modal} onClick={() => showModal(modal)}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer"
                  style={{ background: 'transparent', border: '1px solid var(--lp-card-border)', color: 'var(--lp-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--lp-perk-border)'; e.currentTarget.style.color = 'var(--lp-gold-accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--lp-card-border)'; e.currentTarget.style.color = 'var(--lp-muted)'; }}>
                  <Icon size={11} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* phone carousel */}
          <div className="flex-1 flex flex-col items-center">
            <div className="relative">
              <div className="absolute pointer-events-none" style={{
                inset: '-32px', borderRadius: '56px',
                background: 'radial-gradient(ellipse at center,var(--lp-glow1) 0%,transparent 70%)',
              }} />
              <div ref={phoneRef}
                className="relative w-[340px] h-[720px] sm:w-[380px] sm:h-[720px] animate-float cursor-grab select-none"
                style={{
                  borderRadius: '44px',
                  background: 'linear-gradient(160deg,#2a2418,#1a1610)',
                  boxShadow: '0 0 0 1px rgba(212,168,67,0.22),inset 0 0 0 1px rgba(255,255,255,0.03),0 32px 80px rgba(0,0,0,0.5)',
                }}>
                <div className="absolute top-0 inset-x-8 h-px rounded-full"
                  style={{ background: 'linear-gradient(to right,transparent,rgba(212,168,67,0.45),transparent)' }} />
                <div className="absolute inset-[8px] rounded-[36px] overflow-hidden" style={{ background: '#fdf8f0' }}>
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 w-20 h-4 rounded-full" style={{ background: '#1a1610' }} />
                  <div data-phone-content className="h-full pt-5 overflow-hidden will-change-transform">
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

            <div className="flex items-center gap-1 mt-8" style={{ fontFamily: 'Arial,sans-serif' }}>
              <Input
                type="number"
                value={inputPage}
                min={1}
                max={604}
                onChange={handlePageInputChange}
                onBlur={handlePageInputBlur}
                className="text-xs font-bold text-center w-10 h-6 rounded-full tabular-nums px-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-[rgba(212,168,67,0.6)]"
                style={{
                  color: 'var(--lp-carousel-num)',
                  border: '1px solid var(--lp-perk-border)',
                  MozAppearance: 'textfield',
                  WebkitAppearance: 'none',
                }}
              />
              <span className="text-xs font-bold tabular-nums" style={{ color: 'var(--lp-carousel-num)' }}>/ 604</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce" style={{ color: 'var(--lp-scroll-hint)' }}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ══ MARQUEE ══ */}
      <div className="overflow-hidden py-3.5 border-y select-none" style={{ background: 'var(--lp-ticker-bg)', borderColor: 'var(--lp-ticker-border)' }}>
        <div className="flex animate-marquee whitespace-nowrap" style={{ willChange: 'transform' }}>
          {tickerArr.map((name, i) => (
            <span key={i} className="inline-flex items-center">
              <span className="text-sm font-bold mx-5" style={{ color: 'var(--lp-ticker-name)' }}>{name}</span>
              <span style={{ color: 'var(--lp-ticker-star)', fontSize: '9px' }}>✦</span>
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
                <div className="font-bold text-xl mb-2" style={{ color: 'var(--lp-text)' }}>{s.unit}</div>
                <div className="text-sm" style={{ color: 'var(--lp-faint)' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="py-24" style={sectionA}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase mb-4 block" style={{ color: 'var(--lp-gold-accent)', opacity: 0.7 }}>بسيط وسريع</span>
            <h2 className="text-4xl font-black mb-4"><span style={GT}>كيف يعمل التطبيق؟</span></h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--lp-muted)' }}>ثلاث خطوات بسيطة تبدأ بها تجربتك مع القرآن الكريم</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-[56px] right-[calc(16.67%+28px)] left-[calc(16.67%+28px)] h-px"
              style={{ background: 'linear-gradient(to left,var(--lp-card-border),var(--lp-perk-border),var(--lp-card-border))' }} />
            {STEPS.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1" style={GC}>
                <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: 'linear-gradient(135deg,#c8952a,#e8b85a)', boxShadow: '0 8px 24px rgba(212,168,67,0.28)' }}>
                  <step.Icon size={22} style={{ color: '#1a0f00' }} />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center"
                    style={{ background: 'var(--lp-bg)', border: '2px solid var(--lp-card-border)', color: 'var(--lp-gold-accent)' }}>
                    {step.num}
                  </span>
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: 'var(--lp-text)' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--lp-muted)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES BENTO ══ */}
      <section className="py-24" style={sectionB}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-widest uppercase mb-4 block" style={{ color: 'var(--lp-gold-accent)', opacity: 0.7 }}>مميزات شاملة</span>
            <h2 className="text-4xl font-black mb-3"><span style={GT}>كل ما تحتاجه في مكان واحد</span></h2>
            <p className="text-sm" style={{ color: 'var(--lp-muted)' }}>تجربة قرآنية متكاملة بين يديك</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Large hero card */}
            <div className="lg:col-span-2 lg:row-span-2 rounded-3xl p-8 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[260px] lg:min-h-0"
              style={{ background: 'var(--lp-large-card-bg)', border: '1px solid var(--lp-large-card-border)' }}>
              <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-3xl"
                style={{ background: 'linear-gradient(to right,transparent,#c8952a,#e8b85a,#c8952a,transparent)' }} />
              <div className="absolute -bottom-4 -left-4 pointer-events-none" style={{ opacity: 'var(--lp-book-opacity)' }}>
                <BookOpen size={200} style={{ color: '#d4a843' }} />
              </div>
              <div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: 'linear-gradient(135deg,#c8952a,#e8b85a)', boxShadow: '0 8px 24px rgba(212,168,67,0.28)' }}>
                  <BookOpen size={24} style={{ color: '#1a0f00' }} />
                </div>
                <h3 className="font-black text-2xl mb-3" style={{ color: 'var(--lp-text)' }}>قراءة القرآن الكريم</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--lp-muted)' }}>
                  اقرأ كامل المصحف الشريف بخط مُتقَن جميل مع تتبع تلقائي لآخر صفحة توقفت عندها
                </p>
              </div>
              <Link href={getQuranUrl(startPage)}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold no-underline w-fit transition-all"
                style={{ background: 'var(--lp-link-bg)', border: '1px solid var(--lp-link-border)', color: 'var(--lp-link-color)' }}>
                اقرأ الآن <ArrowLeft size={13} />
              </Link>
            </div>

            {FEATURES.slice(1).map((feat, i) => (
              <div key={i} className="rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1" style={GC}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'var(--lp-icon-bg)', border: '1px solid var(--lp-icon-border)' }}>
                  <feat.Icon size={18} style={{ color: 'var(--lp-gold-accent)' }} />
                </div>
                <h3 className="font-bold text-sm mb-1.5" style={{ color: 'var(--lp-text)' }}>{feat.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--lp-muted)' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VERSE SPOTLIGHT — always dark for drama ══ */}
      <section className="py-32 relative overflow-hidden" style={{ background: 'var(--lp-verse-bg)' }}>
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
            <span className="text-xs font-bold tracking-widest uppercase mb-4 block" style={{ color: 'var(--lp-gold-accent)', opacity: 0.7 }}>نخبة من القراء</span>
            <h2 className="text-4xl font-black mb-3"><span style={GT}>استمع لأفضل القراء</span></h2>
            <p className="text-sm" style={{ color: 'var(--lp-muted)' }}>اختر القارئ المفضل لديك من بين نخبة من العلماء والمقرئين</p>
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
                <h3 className="font-bold mb-1" style={{ color: 'var(--lp-text)' }}>{r.name}</h3>
                <p className="text-xs mb-5" style={{ color: 'var(--lp-faint)' }}>{r.country}</p>
                <Link href={getQuranUrl(startPage)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold no-underline px-4 py-2 rounded-full transition-all"
                  style={{ background: 'var(--lp-chip-bg)', border: '1px solid var(--lp-chip-border)', color: 'var(--lp-link-color)' }}>
                  <Volume2 size={11} />
                  استمع الآن
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TAFSEER ══ */}
      <section className="py-24" style={sectionB}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-widest uppercase mb-4 block" style={{ color: 'var(--lp-gold-accent)', opacity: 0.7 }}>التفسير والترجمة</span>
            <h2 className="text-4xl font-black mb-3"><span style={GT}>افهم كلام الله</span></h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--lp-muted)' }}>تفسيران عظيمان يُنيران معاني القرآن الكريم بأسلوبين مختلفين</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {TAFSEERS.map(t => (
              <div key={t.key} className="rounded-3xl p-8 relative overflow-hidden flex flex-col gap-5"
                style={{ background: 'var(--lp-large-card-bg)', border: '1px solid var(--lp-large-card-border)' }}>
                <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-3xl"
                  style={{ background: 'linear-gradient(to right,transparent,#c8952a,#e8b85a,#c8952a,transparent)' }} />
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#c8952a,#e8b85a)', boxShadow: '0 6px 20px rgba(212,168,67,0.25)' }}>
                    <t.Icon size={20} style={{ color: '#1a0f00' }} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg mb-0.5" style={{ color: 'var(--lp-text)' }}>{t.title}</h3>
                    <p className="text-xs font-bold" style={{ color: 'var(--lp-gold-accent)', opacity: 0.8 }}>{t.author}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--lp-muted)' }}>{t.desc}</p>
                <div className="rounded-2xl p-4 mt-auto" style={GC}>
                  <p className="text-[10px] font-bold mb-2 tracking-wide" style={{ color: 'var(--lp-gold-accent)' }}>مثال — سورة العلق (١)</p>
                  <p className="font-almushaf text-base leading-loose mb-2" style={{ color: 'var(--lp-text)' }}>ٱقۡرَأۡ بِٱسۡمِ رَبِّكَ ٱلَّذِى خَلَقَ</p>
                  <p className="text-xs leading-relaxed truncate" style={{ color: 'var(--lp-muted)' }}>{t.sample}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Translation row */}
          <div className="rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-5" style={GC}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--lp-icon-bg)', border: '1px solid var(--lp-icon-border)' }}>
              <Languages size={20} style={{ color: 'var(--lp-gold-accent)' }} />
            </div>
            <div className="text-center sm:text-right flex-1">
              <h3 className="font-bold text-base mb-1" style={{ color: 'var(--lp-text)' }}>ترجمة معاني القرآن الكريم</h3>
              <p className="text-sm" style={{ color: 'var(--lp-muted)' }}>
                ترجمة معاني القرآن الكريم للإنجليزية بقلم الشيخ أحمد رضا — متاحة بنقرة واحدة على أي آية
              </p>
            </div>
            <div className="flex-shrink-0 text-xs font-bold px-4 py-2 rounded-full"
              style={{ background: 'var(--lp-chip-bg)', border: '1px solid var(--lp-chip-border)', color: 'var(--lp-link-color)' }}>
              Ahmed Raza Khan
            </div>
          </div>
        </div>
      </section>

      {/* ══ APP MOCKUPS ══ */}
      <section className="py-24 overflow-hidden" style={sectionB}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase mb-4 block" style={{ color: 'var(--lp-gold-accent)', opacity: 0.7 }}>تصميم أنيق</span>
            <h2 className="text-4xl font-black mb-4"><span style={GT}>تصميم يناسب ذوقك</span></h2>
            <p className="text-sm max-w-sm mx-auto leading-relaxed" style={{ color: 'var(--lp-muted)' }}>
              اختر الوضع الذي يناسبك — فاتح لوضوح النهار، ومظلم لسكينة الليل
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-14 lg:gap-0">

            {/* ── Light mode ── */}
            <div className="flex flex-col items-center gap-8 lg:flex-1">
              <div className="relative">
                <div className="absolute pointer-events-none" style={{ inset: '-32px', borderRadius: '52px', background: 'radial-gradient(ellipse at center,var(--lp-glow1) 0%,transparent 68%)' }} />
                <div className="relative w-[220px] h-[464px] rounded-[40px] overflow-hidden"
                  style={{ background: 'linear-gradient(160deg,#2a2418,#1a1610)', boxShadow: '0 0 0 1px rgba(212,168,67,0.25),0 28px 72px rgba(0,0,0,0.35)' }}>
                  <div className="absolute inset-[7px] rounded-[32px] overflow-hidden">
                    <HomeMockup />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold mb-4"
                  style={{ background: 'var(--lp-perk-bg)', border: '1px solid var(--lp-perk-border)', color: 'var(--lp-gold-accent)' }}>
                  <Sun size={11} />
                  الوضع الفاتح
                </div>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--lp-muted)' }}>
                  {['خلفية كريمية دافئة لراحة العين','نصوص داكنة بتباين عالٍ','مثالي للقراءة في النهار'].map(f => (
                    <li key={f} className="flex items-center justify-center gap-2">
                      <span style={{ color: 'var(--lp-gold-accent)', fontSize: '7px' }}>✦</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="hidden lg:flex flex-col items-center gap-3 px-10 self-stretch justify-center">
              <div className="flex-1 w-px" style={{ background: 'linear-gradient(to bottom,transparent,var(--lp-card-border))' }} />
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--lp-card-bg)', border: '1px solid var(--lp-card-border)' }}>
                <span style={{ color: 'var(--lp-gold-accent)', fontSize: '14px' }}>✦</span>
              </div>
              <div className="flex-1 w-px" style={{ background: 'linear-gradient(to top,transparent,var(--lp-card-border))' }} />
            </div>

            {/* ── Dark mode ── */}
            <div className="flex flex-col items-center gap-8 lg:flex-1">
              <div className="relative">
                <div className="absolute pointer-events-none" style={{ inset: '-32px', borderRadius: '52px', background: 'radial-gradient(ellipse at center,var(--lp-glow2) 0%,transparent 68%)' }} />
                <div className="relative w-[220px] h-[464px] rounded-[40px] overflow-hidden"
                  style={{ background: 'linear-gradient(160deg,#2a2418,#1a1610)', boxShadow: '0 0 0 1px rgba(212,168,67,0.18),0 28px 72px rgba(0,0,0,0.45)' }}>
                  <div className="absolute inset-[7px] rounded-[32px] overflow-hidden">
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
              </div>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold mb-4"
                  style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.22)', color: '#d4a843' }}>
                  <Moon size={11} />
                  الوضع المظلم
                </div>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--lp-muted)' }}>
                  {['خلفية داكنة تُريح البصر','نصوص ذهبية ناعمة على الظلام','مثالي لقراءة الليل بلا إجهاد'].map(f => (
                    <li key={f} className="flex items-center justify-center gap-2">
                      <span style={{ color: 'var(--lp-gold-accent)', fontSize: '7px' }}>✦</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Try it */}
          <div className="text-center mt-14">
            <button onClick={toggleDark}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{ background: 'var(--lp-perk-bg)', border: '1px solid var(--lp-perk-border)', color: 'var(--lp-gold-accent)' }}>
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
              {isDark ? 'جرّب الوضع الفاتح' : 'جرّب الوضع المظلم'}
            </button>
          </div>
        </div>
      </section>

      {/* ══ ALL FEATURES ══ */}
      <section className="py-24" style={sectionA}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-widest uppercase mb-4 block" style={{ color: 'var(--lp-gold-accent)', opacity: 0.7 }}>كل شيء في مكان واحد</span>
            <h2 className="text-4xl font-black mb-3"><span style={GT}>مميزات التطبيق كاملة</span></h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--lp-muted)' }}>كل ما تحتاجه لرحلتك مع القرآن الكريم</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {ALL_FEATURES.map((f, i) => (
              <div key={i} className="rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1" style={GC}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--lp-icon-bg)', border: '1px solid var(--lp-icon-border)' }}>
                  <f.Icon size={17} style={{ color: 'var(--lp-gold-accent)' }} />
                </div>
                <div>
                  <p className="font-bold text-sm mb-1" style={{ color: 'var(--lp-text)' }}>{f.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--lp-muted)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="py-24" style={sectionB}>
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase mb-4 block" style={{ color: 'var(--lp-gold-accent)', opacity: 0.7 }}>أسئلة وأجوبة</span>
            <h2 className="text-4xl font-black mb-3"><span style={GT}>أسئلة شائعة</span></h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} style={{ borderColor: 'var(--lp-faq-border)' }}>
                <AccordionTrigger className="lp-faq-trigger">{faq.q}</AccordionTrigger>
                <AccordionContent className="lp-faq-content">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="py-32 relative overflow-hidden" style={{ background: 'var(--lp-bg-alt)', color: 'var(--lp-text)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle,var(--lp-cta-dot) 1px,transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 60% at 50% 50%,var(--lp-cta-glow) 0%,transparent 100%)',
        }} />
        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-16" style={{ background: 'var(--lp-card-border)' }} />
            <span style={{ color: 'var(--lp-gold-accent)', fontSize: '16px', opacity: 0.7 }}>✦</span>
            <div className="h-px w-16" style={{ background: 'var(--lp-card-border)' }} />
          </div>

          <h2 className="text-5xl font-black mb-6 leading-tight">
            <span style={{ color: 'var(--lp-text)' }}>ابدأ رحلتك مع</span>
            <br />
            <span style={GT}>القرآن الكريم اليوم</span>
          </h2>

          <p className="mb-10 max-w-md mx-auto" style={{ color: 'var(--lp-cta-muted)' }}>
            انضم لآلاف القراء واستمتع بتجربة قراءة القرآن الكريم بأجمل التصاميم وأفضل الميزات
          </p>

          <Link href={getQuranUrl(startPage)}
            className="group inline-flex items-center gap-3 px-10 py-4 rounded-full font-black text-lg no-underline transition-all"
            style={{ background: 'linear-gradient(to left,#c8952a,#e8b85a)', color: '#1a0f00', boxShadow: '0 12px 40px rgba(212,168,67,0.3)' }}>
            ابدأ القراءة الآن
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </Link>

          <p className="mt-5 text-xs" style={{ color: 'var(--lp-cta-fine)' }}>مجاني تماماً · لا تسجيل مطلوب · يعمل في المتصفح مباشرة</p>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="py-10 border-t" style={{ background: 'var(--lp-footer-bg)', borderColor: 'var(--lp-footer-border)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center opacity-80"
                style={{ background: 'linear-gradient(135deg,#c8952a,#e8b85a)' }}>
                <BookOpen size={14} style={{ color: '#1a0f00' }} />
              </div>
              <div>
                <p className="font-black text-sm" style={GT}>معجزة</p>
                <p className="text-xs" style={{ color: 'var(--lp-footer-text)' }}>تطبيق القرآن الكريم</p>
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
                  style={{ color: 'var(--lp-footer-text)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--lp-gold-accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--lp-footer-text)'}>
                  {item.label}
                </button>
              ))}
            </div>
            <p className="text-xs" style={{ color: 'var(--lp-footer-gold)' }}>تطبيق معجزة — القرآن الكريم</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
