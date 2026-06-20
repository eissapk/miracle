import './globals.css';
import { AppProvider } from '../context/AppContext';
import AppShell from '../components/AppShell';

const BASE_URL = 'https://miracle.eissawebdev.top';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'معجزة — قراءة القرآن الكريم',
    template: '%s | معجزة',
  },
  description: 'اقرأ القرآن الكريم كاملاً بخط جميل واضح، واستمع لأفضل القراء، وتصفح التفسير والترجمة، وأذكار الصباح والمساء. تجربة قرآنية متكاملة تعمل في المتصفح مباشرة.',
  keywords: ['قرآن كريم', 'قراءة القرآن', 'مصحف إلكتروني', 'تلاوة القرآن', 'تفسير القرآن', 'أذكار الصباح والمساء', 'ختمة القرآن', 'عداد تسبيح', 'معجزة', 'Quran', 'Quran reader'],
  authors: [{ name: 'معجزة' }],
  creator: 'معجزة',
  publisher: 'معجزة',
  category: 'religion',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: 'en_US',
    url: BASE_URL,
    siteName: 'معجزة',
    title: 'معجزة — قراءة القرآن الكريم',
    description: 'اقرأ القرآن الكريم كاملاً بخط جميل واضح، واستمع لأفضل القراء، وتصفح التفسير والترجمة، وأذكار الصباح والمساء.',
    images: [{ url: '/img/logo.png', width: 512, height: 512, alt: 'معجزة — قرآن كريم' }],
  },
  twitter: {
    card: 'summary',
    title: 'معجزة — قراءة القرآن الكريم',
    description: 'اقرأ القرآن الكريم كاملاً بخط جميل واضح، مع استماع وتفسير وأذكار.',
    images: ['/img/logo.png'],
  },
  manifest: '/manifest.json',
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'معجزة' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'معجزة',
  alternateName: 'Miracle Quran',
  description: 'تطبيق لقراءة القرآن الكريم كاملاً بخط جميل مع استماع للتلاوة وتفسير وبحث وأذكار',
  url: BASE_URL,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web',
  inLanguage: 'ar',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'قراءة 604 صفحة من القرآن الكريم',
    'استماع للتلاوة مع أفضل القراء',
    'تفسير الميسر والجلالين',
    'ترجمة معاني القرآن للإنجليزية',
    'البحث في آيات القرآن',
    'أذكار الصباح والمساء',
    'عداد التسبيح',
    'تتبع الختمات',
  ],
};

export default function RootLayout({ children }) {
  return (
    <html dir="rtl" lang="ar" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#c8952a" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="canonical" href={BASE_URL} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AppProvider>
          <AppShell>
            <div id="app">
              {children}
            </div>
          </AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
