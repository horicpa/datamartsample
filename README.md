# Segment Data Mart

連結セグメント損益計算書データをベースにした経営管理データマート

## 概要

セグメント損益計算書データを蓄積・管理するデータマートシステムです。
Node.js + Next.js + Reactで構築されたインタラクティブなダッシュボードで、
経営管理に必要なデータを集約し、分析可能な形で可視化します。

## クイックスタート

### Windows (PowerShell)

```powershell
# 1. プロジェクトディレクトリに移動
cd C:\Users\堀哲也\datamartsample

# 2. セットアップスクリプトを実行
powershell -ExecutionPolicy Bypass -File quick-setup.ps1

# 3. 開発環境で起動
npm run dev
```

ブラウザで http://localhost:3000 にアクセス

### macOS / Linux

```bash
# 1. プロジェクトディレクトリに移動
cd ~/datamartsample

# 2. ディレクトリ構造を作成
mkdir -p src/{app/{api/{dashboard,segments,init-sample-data}},components,lib,types,__tests__}

# 3. package.json などの設定ファイルをコピー
# （別途ファイル配置ガイドを参照）

# 4. npm install
npm install

# 5. 開発環境で起動
npm run dev
```

## プロジェクト構成

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API Routes
│   │   │   ├── dashboard/
│   │   │   ├── segments/
│   │   │   └── init-sample-data/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/             # React コンポーネント
│   │   ├── Dashboard.tsx
│   │   ├── MetricsCard.tsx
│   │   ├── SegmentAnalysis.tsx
│   │   ├── SegmentDetail.tsx
│   │   ├── DataTable.tsx
│   │   └── InitializeButton.tsx
│   ├── lib/                    # ユーティリティ関数
│   │   ├── datamart.ts         # SQLiteデータマート
│   │   ├── sampleData.ts       # サンプルデータ生成
│   │   └── store.ts            # Zustand状態管理
│   ├── types/                  # TypeScript型定義
│   │   └── index.ts
│   └── __tests__/              # テスト
│       └── sampleData.test.ts
├── public/                     # 静的ファイル
├── package.json                # Node.js依存関係
├── tsconfig.json               # TypeScript設定
├── next.config.js              # Next.js設定
├── tailwind.config.ts          # Tailwind CSS設定
├── jest.config.js              # Jest設定
├── postcss.config.js           # PostCSS設定
├── .eslintrc.json              # ESLint設定
└── README.md
```

## セットアップ

### 方法1: PowerShellスクリプト（推奨 - Windows）

```powershell
powershell -ExecutionPolicy Bypass -File quick-setup.ps1
```

このスクリプトが実行される：
- ✅ ディレクトリ構造を作成
- ✅ package.json などの設定ファイルを生成
- ✅ npm install を実行

その後、ソースファイルを配置してください（以下のファイル配置ガイドを参照）

### 方法2: 手動セットアップ

```bash
# 1. Node.js をインストール（https://nodejs.org/）
# 2. 依存関係をインストール
npm install

# 3. ソースファイルを配置（以下を参照）

# 4. 開発環境で起動
npm run dev
```

## ファイル配置ガイド

`quick-setup.ps1` 実行後、以下のファイルを対応するディレクトリにコピーしてください。
各ファイルの内容は、GitHubリポジトリまたはサーバー側から取得できます。

### src/types/index.ts
TypeScript型定義ファイル

### src/lib/datamart.ts
SQLiteベースのデータマート実装

### src/lib/sampleData.ts
サンプルデータ生成関数

### src/lib/store.ts
Zustand状態管理ストア

### src/components/ 内のファイル
- Dashboard.tsx - メインダッシュボード
- MetricsCard.tsx - KPI表示カード
- SegmentAnalysis.tsx - セグメント別売上分析
- SegmentDetail.tsx - セグメント詳細分析
- DataTable.tsx - データテーブル
- InitializeButton.tsx - サンプルデータ初期化ボタン

### src/app/ 内のファイル
- layout.tsx - ルートレイアウト
- page.tsx - メインページ
- globals.css - グローバルスタイル
- api/dashboard/route.ts - ダッシュボードAPI
- api/segments/route.ts - セグメント詳細API
- api/init-sample-data/route.ts - サンプルデータ初期化API

### src/__tests__/sampleData.test.ts
サンプルデータのテストケース

## 使用方法

### インタラクティブダッシュボード（Next.js + React）

開発環境で実行：
```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセス

本番環境で実行：
```bash
npm run build
npm start
```

#### ダッシュボードの機能

- **📊 データ概要**: 蓄積データの統計情報
  - 総レコード数、セグメント数、会社数、売上高合計を表示

- **💹 セグメント別売上分析**:
  - セグメント別売上高（棒グラフ）
  - セグメント別営業利益率（棒グラフ）
  - セグメント別サマリーテーブル

- **🔍 セグメント別詳細分析**:
  - 損益計算書フロー（販売費→営業利益の推移）
  - 会社別売上比率（パイチャート）
  - セグメント選択による動的表示

- **📋 詳細データ**:
  - セグメント別サマリーテーブル
  - 機能説明（このデータマートでできることの説明）

- **🔧 サンプルデータ初期化**:
  - 12ヶ月分の模擬セグメント損益計算書データを自動生成
  - 3セグメント × 3会社 × 7科目の構成

### テスト実行

```bash
npm test
```

テストの例：
- サンプルデータ生成のテスト
- アイテム数の検証（63件: 3セグメント × 7科目 × 3会社）
- セグメント数、科目数の検証
- 複数月分のレポート生成テスト

## API エンドポイント

### ダッシュボード用API
- `GET /api/dashboard` - ダッシュボード用集計データを取得

### セグメント詳細API
- `GET /api/segments?abbr=SEG_A` - 特定セグメントの損益計算書と会社別売上を取得
- `GET /api/segments` - すべてのセグメントデータを取得

### サンプルデータ初期化API
- `POST /api/init-sample-data` - サンプルデータを初期化

## データベース

SQLiteを使用（`segment_datamart.db`）

テーブル：
- `segment_profit_and_loss` - セグメント損益計算書データ
  - id, sub_category, account_code, account_name_ja
  - company_abbreviation, company_name_ja
  - segment_abbreviation, segment_name_ja
  - journal_type, segment_amount, fetched_at
