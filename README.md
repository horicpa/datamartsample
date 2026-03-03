# Segment Data Mart

連結セグメント損益計算書データをベースにした経営管理データマート

## 概要

MoneyForward 連結会計APIから取得したセグメント損益計算書データを蓄積・管理するデータマートシステムです。
経営管理プロダクトや会計プロダクトから必要なデータを集約し、分析可能な形で保持します。

## プロジェクト構成

```
├── src/
│   ├── api/              # MoneyForward API クライアント
│   ├── models/           # データモデル・スキーマ定義
│   ├── datamart/         # データマート処理
│   └── main.py          # エントリーポイント
├── tests/               # テスト
├── requirements.txt     # Python依存関係
└── README.md
```

## セットアップ

```bash
pip install -r requirements.txt
```

## 使用方法

### 1. セグメント損益計算書データマート（CLI）

APIトークンを環境変数に設定：
```bash
export MONEYFORWARD_API_TOKEN="your-api-token"
```

セグメント損益計算書データを取得・蓄積：
```bash
python src/main.py --unit-id <unit_id>
```

蓄積データを表示：
```bash
python src/main.py --unit-id <unit_id> --list
```

サマリーを表示：
```bash
python src/main.py --unit-id <unit_id> --summary
```

### 2. インタラクティブダッシュボード（Streamlit）

ダッシュボードを起動：
```bash
streamlit run src/dashboard.py
```

ブラウザで http://localhost:8501 にアクセス

#### ダッシュボードの機能

- **📊 データ概要**: 蓄積データの統計情報
- **💹 セグメント別売上分析**:
  - セグメント別売上高の比較
  - セグメント別利益率の分析
- **🔍 セグメント別詳細分析**:
  - 損益計算書フロー（ウォーターフォール図）
  - 会社別売上比率（パイチャート）
- **📋 詳細データ**:
  - セグメント別サマリーテーブル
  - 詳細データの閲覧・抽出
- **✨ 機能説明**: このデータマートで実現できることの説明
