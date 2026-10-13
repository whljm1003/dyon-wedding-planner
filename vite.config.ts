import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages는 https://<user>.github.io/wedding-planner/ 경로로 서비스되므로
// 빌드 시 base 경로를 저장소 이름으로 맞춥니다. (도메인 연결 후에는 '/'로 변경)
export default defineConfig(({ command }) => ({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: { output: { manualChunks: { firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'] } } },
  },
  base: command === 'build' ? process.env.VITE_BASE ?? '/wedding-planner/' : '/',
}))
