const BASE_URL = 'https://miracle.eissawebdev.top';

export default function sitemap() {
  const readPages = Array.from({ length: 604 }, (_, i) => ({
    url: `${BASE_URL}/read/${i + 1}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: i === 0 ? 0.8 : 0.5,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    ...readPages,
  ];
}
