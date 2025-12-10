
// 定数定義
const DEFAULT_PRELOAD_COUNT = 3;

// セグメントを順次再生する関数
export async function playSegmentsSequentially(segmentUrls: string[]) {
  const audioCtx = new AudioContext();
  const preloadCount = DEFAULT_PRELOAD_COUNT;

  // 再生スケジュールの初期化
  let playTime = 0;

  // 最初のセグメントをプリロード
  const [preloadBuffers, elapsedTime] = await preloadInitialSegments(audioCtx, segmentUrls, preloadCount);
  playTime += elapsedTime / 1000;
  playTime = await scheduleBuffers(audioCtx, preloadBuffers, playTime);

  // 残りのセグメントを順次ロード＆再生
  await scheduleRemainingSegments(audioCtx, segmentUrls, preloadCount, playTime);
}

// 最初のセグメントをプリロードする
async function preloadInitialSegments(
  audioCtx: AudioContext,
  segmentUrls: string[],
  preloadCount: number
): Promise<[AudioBuffer[], number]> {
  const startTime = performance.now();

  const preloadBuffers = await Promise.all(
    segmentUrls.slice(0, preloadCount).map(loadBuffer(audioCtx))
  );

  const endTime = performance.now();
  const elapsedTime = endTime - startTime;
  console.log(`Preloaded ${preloadCount} segments in ${elapsedTime}ms`);

  return [preloadBuffers, elapsedTime];
}

// バッファをスケジュールして再生時間を更新する
async function scheduleBuffers(
  audioCtx: AudioContext,
  buffers: AudioBuffer[],
  initialPlayTime: number
): Promise<number> {
  let playTime = initialPlayTime;

  for (const buffer of buffers) {
    await scheduleBufferSource(audioCtx, buffer, playTime);
    playTime += buffer.duration;
  }

  return playTime;
}

// 残りのセグメントを順次ロード＆再生する
async function scheduleRemainingSegments(
  audioCtx: AudioContext,
  segmentUrls: string[],
  preloadCount: number,
  initialPlayTime: number
) {
  let playTime = initialPlayTime;

  for (let i = preloadCount; i < segmentUrls.length; i++) {
    const buffer = await loadBuffer(audioCtx)(segmentUrls[i]);
    await scheduleBufferSource(audioCtx, buffer, playTime);
    playTime += buffer.duration;
  }
}

// オーディオバッファをロードする
function loadBuffer(audioCtx: AudioContext) {
  return async (url: string): Promise<AudioBuffer> => {
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    return await audioCtx.decodeAudioData(arrayBuffer);
  };
}

// バッファをスケジュールして再生する
async function scheduleBufferSource(
  audioCtx: AudioContext,
  buffer: AudioBuffer,
  playTime: number
) {
  const src = audioCtx.createBufferSource();
  src.buffer = buffer;
  src.connect(audioCtx.destination);
  src.start(playTime);
}
  