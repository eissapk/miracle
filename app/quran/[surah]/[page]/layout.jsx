import { redirect } from 'next/navigation';
import { PAGE_INDEX, SURAH_SLUGS, getQuranUrl } from '../../../../services/pageIndex';

const BASE_URL = 'https://miracle.eissawebdev.top';

const JUZ_NAMES = {
  1:'الأول',2:'الثاني',3:'الثالث',4:'الرابع',5:'الخامس',
  6:'السادس',7:'السابع',8:'الثامن',9:'التاسع',10:'العاشر',
  11:'الحادي عشر',12:'الثاني عشر',13:'الثالث عشر',14:'الرابع عشر',15:'الخامس عشر',
  16:'السادس عشر',17:'السابع عشر',18:'الثامن عشر',19:'التاسع عشر',20:'العشرون',
  21:'الحادي والعشرون',22:'الثاني والعشرون',23:'الثالث والعشرون',24:'الرابع والعشرون',
  25:'الخامس والعشرون',26:'السادس والعشرون',27:'السابع والعشرون',28:'الثامن والعشرون',
  29:'التاسع والعشرون',30:'الثلاثون',
};

function getPageData(page) {
  const [surahName, juzNum, surahNum] = PAGE_INDEX[page - 1] || ['القرآن الكريم', 1, 1];
  const slug = SURAH_SLUGS[surahNum - 1] || 'al-fatiha';
  const pageUrl = `${BASE_URL}/quran/${slug}/${page}`;
  const juzLabel = JUZ_NAMES[juzNum] ? `الجزء ${JUZ_NAMES[juzNum]}` : '';
  return { surahName, juzLabel, slug, pageUrl };
}

export async function generateMetadata({ params }) {
  const p = await params;
  const page = parseInt(p.page, 10);
  if (isNaN(page) || page < 1 || page > 604) {
    return { title: { absolute: 'القرآن الكريم | معجزة' } };
  }

  const { surahName, juzLabel, pageUrl } = getPageData(page);
  const title = `صفحة ${page} — سورة ${surahName} | معجزة`;
  const description = `اقرأ صفحة ${page} من القرآن الكريم — سورة ${surahName}${juzLabel ? ` · ${juzLabel}` : ''} · بخط جميل واضح مع التفسير والاستماع للتلاوة. تطبيق معجزة للقرآن الكريم.`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: pageUrl,
      languages: { 'ar': pageUrl },
    },
    openGraph: {
      type: 'article',
      locale: 'ar_SA',
      url: pageUrl,
      siteName: 'معجزة',
      title,
      description,
      images: [{ url: '/img/logo.png', width: 512, height: 512, alt: 'معجزة — قرآن كريم' }],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: ['/img/logo.png'],
    },
  };
}

export default async function QuranLayout({ children, params }) {
  const p = await params;
  const page = parseInt(p.page, 10);

  if (!isNaN(page) && page >= 1 && page <= 604) {
    const correctUrl = getQuranUrl(page);
    if (p.surah !== correctUrl.split('/')[2]) redirect(correctUrl);
  }

  const validPage = !isNaN(page) && page >= 1 && page <= 604;
  const breadcrumbSchema = validPage ? (() => {
    const { surahName, pageUrl } = getPageData(page);
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'معجزة', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: `سورة ${surahName} — صفحة ${page}`, item: pageUrl },
      ],
    };
  })() : null;

  return (
    <>
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {children}
    </>
  );
}
