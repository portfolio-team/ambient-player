import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

// 環境変数から値を取得
const R2_BASE_URL = process.env.R2_BASE_URL || "";
const INDEX_FILE_PATH = process.env.INDEX_FILE_PATH || "";

// public/config.js を生成する関数
const generateConfigJs = () => {
  const configContent = `
    const R2_BASE_URL = '${R2_BASE_URL}';
    const INDEX_FILE_PATH = '${INDEX_FILE_PATH}';

    export { R2_BASE_URL, INDEX_FILE_PATH };
  `;

  const outputPath = path.join(process.cwd(), "public", "config.js");
  fs.writeFileSync(outputPath, configContent, "utf8");
  console.log("Generated public/config.js");
};

// Next.js の設定
const nextConfig: NextConfig = {
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     // クライアントサイドのビルド時に config.js を生成
  //     generateConfigJs();
  //   }
  //   return config;
  // },
};

export default nextConfig;