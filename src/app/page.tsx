"use client";
import { useState, useEffect } from "react";
import { playSegmentsSequentially } from "@/lib/audioPlayer";
import { fetchSegmentList } from "@/lib/parseM3U8";

export default function AudioPlayerPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [segments, setSegments] = useState<string[]>([]);

  // Service Worker 登録
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  // m3u8解析してセグメント取得
  useEffect(() => {
    fetchSegmentList("https://pub-794a6166df094bb0ad0355e364217a0d.r2.dev/audio/ambient_DEMO/index.m3u8").then(setSegments);
  }, []);

  const handlePlay = async () => {
    if (segments.length === 0) return;
    await playSegmentsSequentially(segments);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-2xl font-bold">WAV Player</h1>
      <button
        disabled={isPlaying}
        onClick={handlePlay}
        style={{
          backgroundColor: isPlaying ? 'gray' : 'blue', // isPlayingがtrueならグレー、falseなら青
          color: 'white', // テキストの色
          cursor: isPlaying ? 'not-allowed' : 'pointer', // isPlayingがtrueならカーソルを変更
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
        }}
        className="px-4 py-2 text-white bg-blue-600 rounded-xl hover:bg-blue-700"
      >
        {isPlaying ? "再生中..." : "再生開始"}
      </button>
      <p className="text-gray-500 text-sm">
        {segments.length
          ? `${segments.length} セグメント読み込み済み`
          : "index.m3u8 解析中..."}
      </p>
    </div>
  );
}
