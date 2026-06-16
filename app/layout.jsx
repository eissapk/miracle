import './globals.css';
import { AppProvider } from '../context/AppContext';
import AppShell from '../components/AppShell';

export const metadata = {
  title: 'Miracle - Quran',
  description: 'Quran Reader App',
};

export default function RootLayout({ children }) {
  return (
    <html dir="rtl" lang="ar">
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
