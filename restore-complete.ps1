# 完全セットアップ・復旧スクリプト（すべてのファイルを自動生成）
# このスクリプトをコピーして PowerShell で実行してください

param([switch]$SkipNpmInstall)

Write-Host "🚀 完全セットアップ・復旧開始" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""

# ディレクトリ構造を作成
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
Write-Host "✅ ディレクトリ構造作成完了`n"

# ===== 設定ファイル =====
Write-Host "⚙️  設定ファイルを生成中..."

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
'@ | Out-File -Encoding UTF8 "package.json" -Force

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
'@ | Out-File -Encoding UTF8 "tsconfig.json" -Force

# next.config.js
@'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

export default nextConfig
'@ | Out-File -Encoding UTF8 "next.config.js" -Force

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
'@ | Out-File -Encoding UTF8 "tailwind.config.ts" -Force

# postcss.config.js
@'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
'@ | Out-File -Encoding UTF8 "postcss.config.js" -Force

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
'@ | Out-File -Encoding UTF8 "jest.config.js" -Force

# jest.setup.js
@'
import '@testing-library/jest-dom'
'@ | Out-File -Encoding UTF8 "jest.setup.js" -Force

# .eslintrc.json
@'
{
  "extends": "next/core-web-vitals"
}
'@ | Out-File -Encoding UTF8 ".eslintrc.json" -Force

# .env.example
@'
DATABASE_URL=segment_datamart.db
NODE_ENV=development
'@ | Out-File -Encoding UTF8 ".env.example" -Force

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
.vscode/
.idea/
*.swp
*.swo

node_modules/
.next/
out/
.cache/

npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
'@ | Out-File -Encoding UTF8 ".gitignore" -Force

Write-Host "✅ 設定ファイル生成完了`n"

# ===== ソースファイル =====
Write-Host "📝 ソースファイルを生成中..."

# src/types/index.ts
@'
/**
 * セグメント損益計算書データモデル
 */

export interface SegmentProfitLossItem {
  id?: number;
  subCategory: string;
  accountCode: string;
  accountNameJa: string;
  companyAbbreviation: string;
  companyNameJa: string;
  segmentAbbreviation: string;
  segmentNameJa: string;
  journalType: 'actual' | 'budget' | 'forecast';
  segmentAmount: number;
  fetchedAt?: Date;
}

export interface SegmentProfitLossReport {
  consolidationAccountingUnit: string;
  segmentProfitAndLossItems: SegmentProfitLossItem[];
  fetchedAt: Date;
}

export interface SegmentSummary {
  segmentAbbreviation: string;
  segmentNameJa: string;
  revenue: number;
  costOfSales: number;
  sgAndA: number;
  operatingIncome: number;
  profitMargin: number;
}

export interface CompanySummary {
  companyAbbreviation: string;
  companyNameJa: string;
  revenue: number;
}

export interface DashboardData {
  totalRecords: number;
  segmentCount: number;
  companyCount: number;
  totalRevenue: number;
  segments: SegmentSummary[];
  lastFetchedAt: Date | null;
}

export interface IncomeStatementLine {
  code: string;
  nameJa: string;
  amount: number;
}
'@ | Out-File -Encoding UTF8 "src\types\index.ts" -Force

# src/lib/sampleData.ts
@'
/**
 * サンプルデータ生成
 * 実際のセグメント損益計算書データを模擬データとして生成
 */

import { SegmentProfitLossReport, SegmentProfitLossItem } from "@/types";

export interface Segment {
  abbr: string;
  name: string;
}

export interface Account {
  code: string;
  nameJa: string;
  category: string;
}

export interface Company {
  abbr: string;
  nameJa: string;
}

/**
 * サンプルセグメント損益計算書を生成
 */
export function generateSampleReport(
  unitId: number = 1,
  daysAgo: number = 0
): SegmentProfitLossReport {
  const segments: Segment[] = [
    { abbr: "SEG_A", name: "セグメントA（国内事業）" },
    { abbr: "SEG_B", name: "セグメントB（海外事業）" },
    { abbr: "SEG_C", name: "セグメントC（新規事業）" },
  ];

  const accounts: Account[] = [
    { code: "1000", nameJa: "売上高", category: "revenue" },
    { code: "1100", nameJa: "売上原価", category: "cost_of_sales" },
    { code: "1200", nameJa: "販売費及び一般管理費", category: "sg_and_a" },
    { code: "1300", nameJa: "営業利益", category: "operating_income" },
    { code: "2100", nameJa: "営業外収益", category: "non_operating_income" },
    { code: "2200", nameJa: "営業外費用", category: "non_operating_expense" },
    { code: "2300", nameJa: "税金等調整前当期利益", category: "income_before_tax" },
  ];

  const companies: Company[] = [
    { abbr: "HQ", nameJa: "本社" },
    { abbr: "SUB1", nameJa: "子会社A" },
    { abbr: "SUB2", nameJa: "子会社B" },
  ];

  const items: SegmentProfitLossItem[] = [];
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - daysAgo);

  for (const segment of segments) {
    for (const account of accounts) {
      for (const company of companies) {
        const baseAmount = 10_000_000;

        let baseMultiplier = 1;
        if (segment.abbr === "SEG_A") {
          baseMultiplier = 2.5;
        } else if (segment.abbr === "SEG_B") {
          baseMultiplier = 1.8;
        } else {
          baseMultiplier = 0.8;
        }

        let amount = baseAmount * baseMultiplier;

        switch (account.category) {
          case "revenue":
            break;
          case "cost_of_sales":
            amount = baseAmount * baseMultiplier * -0.6;
            break;
          case "sg_and_a":
            amount = baseAmount * baseMultiplier * -0.15;
            break;
          case "operating_income":
            amount = baseAmount * baseMultiplier * 0.25;
            break;
          case "non_operating_income":
            amount = baseAmount * baseMultiplier * 0.05;
            break;
          case "non_operating_expense":
            amount = baseAmount * baseMultiplier * -0.03;
            break;
          case "income_before_tax":
            amount = baseAmount * baseMultiplier * 0.27;
            break;
        }

        const variance = Math.random() * 0.2 + 0.9;
        amount = amount * variance;

        const item: SegmentProfitLossItem = {
          subCategory: account.category,
          accountCode: account.code,
          accountNameJa: account.nameJa,
          companyAbbreviation: company.abbr,
          companyNameJa: company.nameJa,
          segmentAbbreviation: segment.abbr,
          segmentNameJa: segment.name,
          journalType: "actual",
          segmentAmount: amount,
          fetchedAt: baseDate,
        };

        items.push(item);
      }
    }
  }

  return {
    consolidationAccountingUnit: `決算単位$${unitId}`,
    segmentProfitAndLossItems: items,
    fetchedAt: baseDate,
  };
}

/**
 * 複数月分のサンプルレポートを生成
 */
export function generateMultipleSampleReports(
  unitId: number = 1,
  numMonths: number = 12
): SegmentProfitLossReport[] {
  const reports: SegmentProfitLossReport[] = [];

  for (let month = 0; month < numMonths; month++) {
    const report = generateSampleReport(unitId, month * 30);
    reports.push(report);
  }

  return reports;
}
'@ | Out-File -Encoding UTF8 "src\lib\sampleData.ts" -Force

Write-Host "  ✓ src\types\index.ts"
Write-Host "  ✓ src\lib\sampleData.ts"

Write-Host "✅ ソースファイル生成完了`n"

# ===== npm install =====
if (-not $SkipNpmInstall) {
    Write-Host "📦 npm install を実行中..."
    npm install
    Write-Host ""
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host "✅ 復旧・セットアップが完了しました！" -ForegroundColor Green
Write-Host ""
Write-Host "📝 次のステップ:"
Write-Host "  1. 残りのソースファイルをコピー"
Write-Host "  2. npm run dev で開発環境を起動"
Write-Host "  3. http://localhost:3000 にアクセス"
Write-Host ""
Write-Host "⚠️  注意: 以下のファイルはまだ手動でコピーが必要です:"
Write-Host "  - src/lib/datamart.ts"
Write-Host "  - src/lib/store.ts"
Write-Host "  - src/components/*.tsx"
Write-Host "  - src/app/ 内のすべてのファイル"
