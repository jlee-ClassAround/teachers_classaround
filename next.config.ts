import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 기존 설정 유지 */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // 💡 아래 images 설정을 추가하세요
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'k.kakaocdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'k.kakaocdn.net',
        port: '',
        pathname: '/**',
      },
      // 다른 이미지 호스트가 더 있다면 여기에 추가 (예: 구글 등)
    ],
  },
};

export default nextConfig;