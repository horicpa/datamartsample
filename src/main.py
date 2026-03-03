"""
メインエントリーポイント
セグメント損益計算書データマート処理
"""

import argparse
import sys
import json
from pathlib import Path

from api import MoneyForwardAPIClient
from datamart import SegmentDataMart


def main():
    parser = argparse.ArgumentParser(
        description="セグメント損益計算書データマート"
    )
    parser.add_argument("--unit-id", type=int, required=True, help="連結決算単位ID")
    parser.add_argument("--db-path", default="segment_datamart.db", help="データベースパス")
    parser.add_argument("--list", action="store_true", help="蓄積データを表示")
    parser.add_argument("--summary", action="store_true", help="サマリーを表示")

    args = parser.parse_args()

    try:
        # データマート初期化
        datamart = SegmentDataMart(db_path=args.db_path)

        if args.list:
            # 蓄積データを表示
            data = datamart.get_segment_data()
            print(f"取得レコード数: {len(data)}")
            for record in data[:5]:  # 最初の5件を表示
                print(json.dumps(record, indent=2, ensure_ascii=False))

        elif args.summary:
            # サマリーを表示
            summary = datamart.get_segment_summary()
            print(f"セグメント数: {len(summary)}")
            for item in summary:
                print(json.dumps(item, indent=2, ensure_ascii=False))

        else:
            # APIからデータを取得して蓄積
            print(f"セグメント損益計算書データを取得中... (unit_id: {args.unit_id})")

            client = MoneyForwardAPIClient()
            report = client.get_segment_profit_and_loss_detail(args.unit_id)

            if report:
                print(f"取得成功: {len(report.segment_profit_and_loss_items)} 件")

                success = datamart.store_report(report)
                if success:
                    print("✓ データマートに蓄積完了")

                    # サマリー表示
                    summary = datamart.get_segment_summary()
                    print(f"\nセグメント要約:")
                    for item in summary:
                        print(f"  - {item['segment_name_ja']}: {item['item_count']} 件, "
                              f"合計: {item['total_amount']:,.0f}")
                else:
                    print("✗ データマートへの蓄積に失敗")
                    return 1
            else:
                print("✗ APIからのデータ取得に失敗")
                return 1

        return 0

    except Exception as e:
        print(f"エラー: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
