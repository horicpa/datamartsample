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

APIトークンを環境変数に設定：
```bash
export MONEYFORWARD_API_TOKEN="your-api-token"
```

セグメント損益計算書データを取得・蓄積：
```bash
python src/main.py --unit-id <unit_id>
```
