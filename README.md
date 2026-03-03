# Segment Data Mart

連結セグメント損益計算書データをベースにした経営管理データマート

## 概要

セグメント損益計算書データを蓄積・管理するデータマートシステムです。
Node.js + Next.js + Reactで構築されたインタラクティブなダッシュボードで、
経営管理に必要なデータを集約し、分析可能な形で可視化します。

## プロジェクト構成

```
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API Routes
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/       # React コンポーネント
│   ├── lib/              # ユーティリティ関数
│   │   ├── datamart.ts   # データマート処理
│   │   ├── sampleData.ts # サンプルデータ生成
│   │   └── store.ts      # Zustand ストア
│   └── types/            # TypeScript型定義
├── .streamlit/           # Streamlit設定
├── public/               # 静的ファイル
├── tests/                # テスト
├── package.json          # Node.js依存関係
├── tsconfig.json         # TypeScript設定
├── next.config.js        # Next.js設定
├── tailwind.config.ts    # Tailwind CSS設定
└── README.md
```

## セットアップ

### Node.js環境の準備

```bash
# 依存関係をインストール
npm install
```

### データベースの初期化

ダッシュボードで「サンプルデータを初期化」ボタンをクリックするか、
以下のコマンドで初期化：

```bash
npm run build
npm start
```

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
