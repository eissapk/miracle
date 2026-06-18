import './globals.css';
import { AppProvider } from '../context/AppContext';
import AppShell from '../components/AppShell';

export const metadata = {
  title: 'Miracle - Quran',
  description: 'Quran Reader App',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Miracle',
  },
};

export default function RootLayout({ children }) {
  return (
    <html dir="rtl" lang="ar" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/icon.svg" />
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
