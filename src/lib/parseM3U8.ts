const R2_BASE_URL = "https://pub-794a6166df094bb0ad0355e364217a0d.r2.dev/audio/ambient_DEMO"; // R2のベースURLを指定

export async function fetchSegmentList(m3u8Url: string): Promise<string[]> {
    const res = await fetch(m3u8Url);
    const text = await res.text();
  
    // #EXTINF 行の次の行がURL
    const lines = text.split("\n").map((l) => l.trim());
    const segmentUrls: string[] = [];
  
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("#EXTINF")) {
        const next = lines[i + 1];
        if (next && !next.startsWith("#")) {

          segmentUrls.push(`${R2_BASE_URL}/${next}`);
        }
      }
    }
    console.log(segmentUrls);
  
    return segmentUrls;
  }
  