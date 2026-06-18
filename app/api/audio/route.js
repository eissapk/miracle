export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const reciter = searchParams.get('reciter');
  const verse = searchParams.get('verse');

  if (!reciter || !verse) {
    return new Response('Missing reciter or verse', { status: 400 });
  }

  const upstream = `https://cdn.islamic.network/quran/audio/64/ar.${reciter}/${verse}.mp3`;

  try {
    const response = await fetch(upstream);
    if (!response.ok) return new Response('Audio not found', { status: 404 });

    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response('Failed to fetch audio', { status: 502 });
  }
}
