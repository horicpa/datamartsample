# セグメント損益計算書データマート - セットアップスクリプト
# このスクリプトを datamartsample フォルダ内で実行してください

Write-Host "📁 プロジェクト構造を作成中..."

# ディレクトリ構造を作成
$dirs = @(
    "src\app\api\dashboard",
    "src\app\api\segments",
    "src\app\api\init-sample-data",
    "src\components",
    "src\lib",
    "src\types",
    "src\__tests__"
)

foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

Write-Host "✅ ディレクトリ構造を作成しました"
Write-Host ""
Write-Host "📋 ファイルを生成中..."

# package.json
@'
{
  "name": "datamart-dashboard",
  "version": "1.0.0",
  "description": "セグメント損益計算書データマートダッシュボード",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "datamart": "node dist/cli.js"
  },
  "dependencies": {
    "better-sqlite3": "^9.2.2",
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.10.4",
    "zustand": "^4.4.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^14.1.2",
    "@types/better-sqlite3": "^7.6.8",
    "@types/jest": "^29.5.11",
    "@types/node": "^20.10.6",
    "@types/react": "^18.2.46",
    "@types/react-dom": "^18.2.18",
    "autoprefixer": "^10.4.17",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3"
  }
}
'@ | Out-File -Encoding UTF8 "package.json"

Write-Host "✅ package.json を作成しました"

# tsconfig.json
@'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "paths": {
      "@/*": ["./src/*"]
    },
    "jsx": "preserve"
  },
  "include": ["src", "next-env.d.ts"],
  "exclude": ["node_modules"]
}
'@ | Out-File -Encoding UTF8 "tsconfig.json"

Write-Host "✅ tsconfig.json を作成しました"

# next.config.js
@'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

export default nextConfig
'@ | Out-File -Encoding UTF8 "next.config.js"

# tailwind.config.ts
@'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#667eea',
        secondary: '#764ba2',
      },
    },
  },
  plugins: [],
}
export default config
'@ | Out-File -Encoding UTF8 "tailwind.config.ts"

# postcss.config.js
@'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
'@ | Out-File -Encoding UTF8 "postcss.config.js"

# jest.config.js
@'
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
}

module.exports = createJestConfig(customJestConfig)
'@ | Out-File -Encoding UTF8 "jest.config.js"

# jest.setup.js
@'
import '@testing-library/jest-dom'
'@ | Out-File -Encoding UTF8 "jest.setup.js"

# .eslintrc.json
@'
{
  "extends": "next/core-web-vitals"
}
'@ | Out-File -Encoding UTF8 ".eslintrc.json"

# .env.example
@'
# Database
DATABASE_URL=segment_datamart.db

# Application
NODE_ENV=development
'@ | Out-File -Encoding UTF8 ".env.example"

Write-Host "✅ 設定ファイルを作成しました"
Write-Host ""
Write-Host "📦 npm install を実行中..."
Write-Host ""

npm install

Write-Host ""
Write-Host "✅ セットアップが完了しました！"
Write-Host ""
Write-Host "🚀 起動コマンド:"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "ブラウザで http://localhost:3000 にアクセスしてください"
