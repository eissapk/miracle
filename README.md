# معجزة — Quran Web App

A modern Progressive Web App (PWA) for reading the Holy Quran, built with Next.js 14 and Tailwind CSS.

## Features

- **Full Quran** — all 604 pages, 114 surahs, 6236 verses embedded — no internet required for reading
- **Audio recitation** — listen with Maher Al-Muaiqly, Ahmed Al-Ajamy, or Mahmoud Khalil Al-Husary
- **Tafseer** — Al-Muyassar and Al-Jalalayn commentaries, plus Ahmed Raza Khan's English translation
- **Smart search** — instant search across any verse or word
- **Bookmarks** — save and quickly return to favorite pages
- **Progress tracking** — auto-saves last read page; record and review Quran completions (ختمات)
- **Adhkar & Tasbih** — morning/evening adhkar and a counter with daily goal setting
- **Dark / light mode** — warm cream background for day, dark gold-on-black for night
- **Verse coloring** — highlight verses with custom colors
- **Swipe navigation** — slide between pages with touch or drag gestures
- **PWA** — installable, works offline for reading

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + CSS variables |
| UI primitives | Radix UI (Accordion), Lucide icons |
| PWA | `@ducanh2912/next-pwa` |
| Icons | `olum-icons` |

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
```

## Project Structure

```
app/
  page.jsx          # Landing page
  layout.jsx        # Root layout + app shell
  quran/[surah]/    # Quran reader route
  api/              # API routes
components/
  modals/           # Feature modals (search, azkar, tasbih, bookmarks…)
  ui/               # Shared UI components
context/            # App-wide state (dark mode, modal control)
services/           # Helpers (page index, filters…)
public/
  sw.js             # Service worker
```

## Routes

| Path | Description |
|---|---|
| `/` | Landing page |
| `/quran/[surahName]/[pageNum]` | Quran reader |
