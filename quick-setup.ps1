# セグメント損益計算書データマート - ワンストップセットアップスクリプト
# このスクリプトを実行すると、すべてのプロジェクトファイルが自動生成されます

param([switch]$SkipNpmInstall)

Write-Host "🚀 セグメント損益計算書データマート - セットアップ開始"
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""

# 1. ディレクトリ構造を作成
Write-Host "📁 ディレクトリ構造を作成中..."
$dirs = @(
    "src\app\api\dashboard",
    "src\app\api\segments",
    "src\app\api\init-sample-data",
    "src\components",
    "src\lib",
    "src\types",
    "src\__tests__",
    "public"
)

foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}
Write-Host "✅ ディレクトリ構造を作成しました"
Write-Host ""

# 2. 設定ファイルを作成
Write-Host "⚙️  設定ファイルを生成中..."

# package.json
$packageJson = @'
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
    "test:watch": "jest --watch"
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
'@
$packageJson | Out-File -Encoding UTF8 -Path "package.json" -Force
Write-Host "  ✓ package.json"

# tsconfig.json
$tsconfig = @'
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
'@
$tsconfig | Out-File -Encoding UTF8 -Path "tsconfig.json" -Force
Write-Host "  ✓ tsconfig.json"

# next.config.js
@'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

export default nextConfig
'@ | Out-File -Encoding UTF8 -Path "next.config.js" -Force
Write-Host "  ✓ next.config.js"

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
'@ | Out-File -Encoding UTF8 -Path "tailwind.config.ts" -Force
Write-Host "  ✓ tailwind.config.ts"

# postcss.config.js
@'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
'@ | Out-File -Encoding UTF8 -Path "postcss.config.js" -Force
Write-Host "  ✓ postcss.config.js"

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
'@ | Out-File -Encoding UTF8 -Path "jest.config.js" -Force
Write-Host "  ✓ jest.config.js"

# jest.setup.js
@'
import '@testing-library/jest-dom'
'@ | Out-File -Encoding UTF8 -Path "jest.setup.js" -Force
Write-Host "  ✓ jest.setup.js"

# .eslintrc.json
@'
{
  "extends": "next/core-web-vitals"
}
'@ | Out-File -Encoding UTF8 -Path ".eslintrc.json" -Force
Write-Host "  ✓ .eslintrc.json"

# .env.example
@'
DATABASE_URL=segment_datamart.db
NODE_ENV=development
'@ | Out-File -Encoding UTF8 -Path ".env.example" -Force
Write-Host "  ✓ .env.example"

# .gitignore
@'
*.pyc
__pycache__/
*.db
*.db-journal
.env
.env.local
.env*.local
.DS_Store
.venv
venv/
env/
*.egg-info/
dist/
build/
.pytest_cache/
.coverage
*.log

node_modules/
.next/
out/
.cache/
.turbo/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

.vscode/
.idea/
*.swp
*.swo
*~
'@ | Out-File -Encoding UTF8 -Path ".gitignore" -Force
Write-Host "  ✓ .gitignore"

Write-Host "✅ 設定ファイルを作成しました"
Write-Host ""

# 3. npm install（オプション）
if (-not $SkipNpmInstall) {
    Write-Host "📦 npm install を実行中..."
    npm install
    Write-Host ""
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host "✅ 基本セットアップが完了しました！"
Write-Host ""
Write-Host "📝 次のステップ:"
Write-Host "  1. ソースファイルをコピー (src/ 内のファイル)"
Write-Host "  2. npm run dev を実行"
Write-Host "  3. http://localhost:3000 にアクセス"
Write-Host ""
Write-Host "💡 注意: ソースファイルはまだ手動でコピーする必要があります"
Write-Host "   詳細は README.md を参照してください"
