"""
サンプルデータ生成テスト
"""

import sys
sys.path.insert(0, '/home/user/datamartsample/src')

from sample_data import generate_sample_report, generate_multiple_sample_reports
from datamart import SegmentDataMart
import tempfile
import os


def test_sample_report_generation():
    """サンプルレポート生成のテスト"""
    report = generate_sample_report(unit_id=1)

    assert report is not None
    assert report.consolidation_accounting_unit == "決算単位1"
    assert len(report.segment_profit_and_loss_items) > 0

    # セグメント数のチェック
    segments = set(item.segment_name_ja for item in report.segment_profit_and_loss_items)
    assert len(segments) == 3

    # 科目数のチェック
    accounts = set(item.account_name_ja for item in report.segment_profit_and_loss_items)
    assert len(accounts) == 7

    print(f"✓ サンプルレポート生成: {len(report.segment_profit_and_loss_items)} 件のアイテムを生成")


def test_multiple_reports_generation():
    """複数月分のサンプルレポート生成テスト"""
    reports = generate_multiple_sample_reports(unit_id=1, num_months=12)

    assert len(reports) == 12
    print(f"✓ 複数月レポート生成: {len(reports)} ヶ月分を生成")


def test_datamart_store_and_retrieve():
    """データマート保存・取得テスト"""
    with tempfile.TemporaryDirectory() as tmpdir:
        db_path = os.path.join(tmpdir, "test.db")
        datamart = SegmentDataMart(db_path=db_path)

        # サンプルデータを生成
        report = generate_sample_report(unit_id=1)

        # データマートに保存
        success = datamart.store_report(report)
        assert success
        print(f"✓ データマート保存: {len(report.segment_profit_and_loss_items)} 件を保存")

        # データを取得
        data = datamart.get_segment_data()
        assert len(data) == len(report.segment_profit_and_loss_items)
        print(f"✓ データマート取得: {len(data)} 件を取得")

        # サマリーを取得
        summary = datamart.get_segment_summary()
        assert len(summary) > 0
        print(f"✓ サマリー取得: {len(summary)} 件のセグメントを取得")


def test_segment_filtered_retrieval():
    """セグメントフィルター取得テスト"""
    with tempfile.TemporaryDirectory() as tmpdir:
        db_path = os.path.join(tmpdir, "test.db")
        datamart = SegmentDataMart(db_path=db_path)

        # サンプルデータを生成
        report = generate_sample_report(unit_id=1)
        datamart.store_report(report)

        # 特定セグメントのデータを取得
        segment_data = datamart.get_segment_data(segment_abbreviation="SEG_A")
        assert len(segment_data) > 0

        # 取得したデータがすべて同じセグメントであることを確認
        for item in segment_data:
            assert item['segment_abbreviation'] == "SEG_A"

        print(f"✓ セグメントフィルター取得: SEG_A の {len(segment_data)} 件を取得")


if __name__ == "__main__":
    print("=" * 50)
    print("サンプルデータテスト")
    print("=" * 50)

    test_sample_report_generation()
    test_multiple_reports_generation()
    test_datamart_store_and_retrieve()
    test_segment_filtered_retrieval()

    print("\n" + "=" * 50)
    print("✓ すべてのテストが成功しました")
    print("=" * 50)
