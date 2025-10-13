export async function playSegmentsSequentially(
    audioCtx: AudioContext,
    segmentUrls: string[]
  ) {
    let currentTime = audioCtx.currentTime;
  
    // 最初の3個を即ロード、それ以降は順次
    const preloadCount = 3;
    const preloadBuffers = await Promise.all(
      segmentUrls.slice(0, preloadCount).map(loadBuffer(audioCtx))
    );
  
    for (const buffer of preloadBuffers) {
      const src = audioCtx.createBufferSource();
      src.buffer = buffer;
      src.connect(audioCtx.destination);
      src.start(currentTime);
      currentTime += buffer.duration;
    }
  
    // 残りを順次ロード再生
    for (let i = preloadCount; i < segmentUrls.length; i++) {
      const buffer = await loadBuffer(audioCtx)(segmentUrls[i]);
      const src = audioCtx.createBufferSource();
      src.buffer = buffer;
      src.connect(audioCtx.destination);
      src.start(currentTime);
      currentTime += buffer.duration;
    }
  }
  
  function loadBuffer(audioCtx: AudioContext) {
    return async (url: string) => {

      const res = await fetch(url);
      const arrayBuffer = await res.arrayBuffer();
      return await audioCtx.decodeAudioData(arrayBuffer);
    };
  }
  