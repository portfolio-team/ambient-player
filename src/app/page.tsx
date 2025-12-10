"use client";
import { useState, useEffect } from "react";
import { playSegmentsSequentially } from "@/lib/audioPlayer";
import { fetchSegmentList } from "@/lib/parseM3U8";
import { R2_BASE_URL, INDEX_FILE_PATH } from '../config';

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
    fetchSegmentList(`${R2_BASE_URL}/${INDEX_FILE_PATH}`).then(setSegments);
  }, []);

  const handlePlay = async () => {
    if (segments.length === 0) return;
    await playSegmentsSequentially(segments);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-2xl font-bold">HLS (WAV) Seamless Player</h1>
      <button
        onClick={handlePlay}
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
