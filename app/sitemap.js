import book from '../services/book';
import { getQuranUrl } from '../services/pageIndex';

const BASE_URL = 'https://miracle.eissawebdev.top';
const LAST_MODIFIED = new Date('2025-06-01');

export default function sitemap() {
  const seen = new Set();
  const surahPages = [];

  for (const [surahNum, surah] of Object.entries(book)) {
    const firstPage = Math.min(...surah.ayahs.map(a => a.page));
    const url = `${BASE_URL}${getQuranUrl(firstPage)}`;
    if (seen.has(url)) continue;
    seen.add(url);
    surahPages.push({
      url,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: surahNum === '1' ? 0.9 : 0.7,
    });
  }

  return [
    { url: BASE_URL, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 1 },
    ...surahPages,
  ];
}
