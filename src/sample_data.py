"""
サンプルデータ生成
実際のセグメント損益計算書データを模擬データとして生成
"""

from datetime import datetime, timedelta
from models import SegmentProfitLossItem, SegmentProfitLossReport
import random


def generate_sample_report(unit_id: int = 1, days_ago: int = 0) -> SegmentProfitLossReport:
    """
    サンプルセグメント損益計算書を生成

    Args:
        unit_id: 連結決算単位ID
        days_ago: 何日前のデータか

    Returns:
        SegmentProfitLossReport: サンプルレポート
    """

    # セグメント定義
    segments = [
        {"abbr": "SEG_A", "name": "セグメントA（国内事業）"},
        {"abbr": "SEG_B", "name": "セグメントB（海外事業）"},
        {"abbr": "SEG_C", "name": "セグメントC（新規事業）"},
    ]

    # 損益計算書科目
    accounts = [
        {"code": "1000", "name_ja": "売上高", "category": "revenue"},
        {"code": "1100", "name_ja": "売上原価", "category": "cost_of_sales"},
        {"code": "1200", "name_ja": "販売費及び一般管理費", "category": "sg_and_a"},
        {"code": "1300", "name_ja": "営業利益", "category": "operating_income"},
        {"code": "2100", "name_ja": "営業外収益", "category": "non_operating_income"},
        {"code": "2200", "name_ja": "営業外費用", "category": "non_operating_expense"},
        {"code": "2300", "name_ja": "税金等調整前当期利益", "category": "income_before_tax"},
    ]

    # 会社定義
    companies = [
        {"abbr": "HQ", "name_ja": "本社"},
        {"abbr": "SUB1", "name_ja": "子会社A"},
        {"abbr": "SUB2", "name_ja": "子会社B"},
    ]

    items = []
    base_date = datetime.now() - timedelta(days=days_ago)

    # 各セグメント、会社、科目の組み合わせでデータ生成
    for segment in segments:
        for account in accounts:
            for company in companies:
                # ベース金額を決定（セグメント別の特性を反映）
                base_amount = 10_000_000  # 1000万円ベース

                if segment["abbr"] == "SEG_A":
                    base_multiplier = 2.5  # 国内事業は大きめ
                elif segment["abbr"] == "SEG_B":
                    base_multiplier = 1.8  # 海外事業は中程度
                else:
                    base_multiplier = 0.8  # 新規事業は小さめ

                # 科目別の利益率
                if account["category"] == "revenue":
                    amount = base_amount * base_multiplier
                elif account["category"] == "cost_of_sales":
                    amount = base_amount * base_multiplier * -0.6  # 売上の60%
                elif account["category"] == "sg_and_a":
                    amount = base_amount * base_multiplier * -0.15  # 売上の15%
                elif account["category"] == "operating_income":
                    amount = base_amount * base_multiplier * 0.25  # 売上の25%
                elif account["category"] == "non_operating_income":
                    amount = base_amount * base_multiplier * 0.05  # 売上の5%
                elif account["category"] == "non_operating_expense":
                    amount = base_amount * base_multiplier * -0.03  # 売上の3%
                else:
                    amount = base_amount * base_multiplier * 0.27  # 税前利益

                # ランダム変動を加える（±10%）
                variance = random.uniform(0.9, 1.1)
                amount = amount * variance

                item = SegmentProfitLossItem(
                    sub_category=account["category"],
                    account_code=account["code"],
                    account_name_ja=account["name_ja"],
                    company_abbreviation=company["abbr"],
                    company_name_ja=company["name_ja"],
                    segment_abbreviation=segment["abbr"],
                    segment_name_ja=segment["name"],
                    journal_type="actual",
                    segment_amount=amount
                )
                items.append(item)

    return SegmentProfitLossReport(
        consolidation_accounting_unit=f"決算単位{unit_id}",
        segment_profit_and_loss_items=items,
        fetched_at=base_date
    )


def generate_multiple_sample_reports(unit_id: int = 1, num_months: int = 12) -> list:
    """
    複数月分のサンプルレポートを生成

    Args:
        unit_id: 連結決算単位ID
        num_months: 生成する月数

    Returns:
        list: SegmentProfitLossReportのリスト
    """
    reports = []
    for month in range(num_months):
        report = generate_sample_report(unit_id, days_ago=month * 30)
        reports.append(report)

    return reports
