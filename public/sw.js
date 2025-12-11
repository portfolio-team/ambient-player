const CACHE_NAME = "audio-cache-v2";
const R2_BASE_URL = "https://pub-794a6166df094bb0ad0355e364217a0d.r2.dev"; // R2のベースURLを指定

self.addEventListener("install", (event) => {
  // install時点ではindex.m3u8だけ先にキャッシュ
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(`${R2_BASE_URL}/audio/ambient_DEMO/index.m3u8`))
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // .wav または index.m3u8 のリクエストを処理
  if (url.pathname.endsWith(".wav") || url.pathname.endsWith("index.m3u8")) {
    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) {
            return cached; // キャッシュがあればそれを返す
            }

            // Cloudflare R2 の URL に置き換え
            const r2Url = url.pathname.endsWith(".wav")
            ? `${R2_BASE_URL}${url.pathname}`
            : event.request.url;
            console.log(`Fetching from R2: ${r2Url}`, ` gg::${url.pathname}`);

            return fetch(r2Url).then((response) => {
                // 成功した場合はキャッシュに保存
                if (response.ok) {
                    return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, response.clone());
                    return response;
                    });
                }
                return response; // エラーの場合はそのまま返す
            });
        })
    );
  }
});