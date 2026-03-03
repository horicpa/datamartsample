"""
データモデル・スキーマ定義
MoneyForward セグメント損益計算書データの構造定義
"""

from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime


@dataclass
class SegmentProfitLossItem:
    """セグメント損益計算書アイテム"""
    sub_category: str
    account_code: str
    account_name_ja: str
    company_abbreviation: str
    company_name_ja: str
    segment_abbreviation: str
    segment_name_ja: str
    journal_type: str
    segment_amount: float


@dataclass
class SegmentProfitLossReport:
    """セグメント損益計算書レポート"""
    consolidation_accounting_unit: str
    segment_profit_and_loss_items: List[SegmentProfitLossItem]
    fetched_at: datetime


class SegmentDataMartSchema:
    """データマート用スキーマ定義"""

    # テーブル定義
    TABLES = {
        'segment_profit_and_loss': '''
            CREATE TABLE IF NOT EXISTS segment_profit_and_loss (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                consolidation_accounting_unit TEXT NOT NULL,
                sub_category TEXT NOT NULL,
                account_code TEXT NOT NULL,
                account_name_ja TEXT NOT NULL,
                company_abbreviation TEXT,
                company_name_ja TEXT,
                segment_abbreviation TEXT NOT NULL,
                segment_name_ja TEXT NOT NULL,
                journal_type TEXT,
                segment_amount REAL NOT NULL,
                fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''',
        'segment_summary': '''
            CREATE TABLE IF NOT EXISTS segment_summary (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                consolidation_accounting_unit TEXT NOT NULL,
                segment_abbreviation TEXT NOT NULL,
                segment_name_ja TEXT NOT NULL,
                total_amount REAL,
                item_count INTEGER,
                fetched_at TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        '''
    }
