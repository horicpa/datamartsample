"""
データマート処理
セグメント損益計算書データの蓄積・管理
"""

import sqlite3
from pathlib import Path
from typing import List, Optional
from datetime import datetime

from models import SegmentProfitLossReport, SegmentProfitLossItem, SegmentDataMartSchema


class SegmentDataMart:
    """セグメント損益計算書データマート"""

    def __init__(self, db_path: str = "segment_datamart.db"):
        """
        初期化

        Args:
            db_path: SQLiteデータベースパス
        """
        self.db_path = db_path
        self.init_database()

    def init_database(self):
        """データベーススキーマを初期化"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        for table_name, create_sql in SegmentDataMartSchema.TABLES.items():
            cursor.execute(create_sql)

        conn.commit()
        conn.close()

    def store_report(self, report: SegmentProfitLossReport) -> bool:
        """
        セグメント損益計算書レポートを蓄積

        Args:
            report: SegmentProfitLossReport

        Returns:
            bool: 成功したかどうか
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        try:
            for item in report.segment_profit_and_loss_items:
                cursor.execute('''
                    INSERT INTO segment_profit_and_loss (
                        consolidation_accounting_unit,
                        sub_category,
                        account_code,
                        account_name_ja,
                        company_abbreviation,
                        company_name_ja,
                        segment_abbreviation,
                        segment_name_ja,
                        journal_type,
                        segment_amount,
                        fetched_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    report.consolidation_accounting_unit,
                    item.sub_category,
                    item.account_code,
                    item.account_name_ja,
                    item.company_abbreviation,
                    item.company_name_ja,
                    item.segment_abbreviation,
                    item.segment_name_ja,
                    item.journal_type,
                    item.segment_amount,
                    report.fetched_at
                ))

            # サマリー情報を更新
            self._update_segment_summary(cursor, report)

            conn.commit()
            return True

        except sqlite3.Error as e:
            print(f"Database Error: {e}")
            conn.rollback()
            return False

        finally:
            conn.close()

    def _update_segment_summary(self, cursor: sqlite3.Cursor, report: SegmentProfitLossReport):
        """セグメントサマリーを更新"""
        segments = {}

        for item in report.segment_profit_and_loss_items:
            key = (item.segment_abbreviation, item.segment_name_ja)
            if key not in segments:
                segments[key] = {"total": 0, "count": 0}

            segments[key]["total"] += item.segment_amount
            segments[key]["count"] += 1

        for (abbr, name), data in segments.items():
            cursor.execute('''
                INSERT OR REPLACE INTO segment_summary (
                    consolidation_accounting_unit,
                    segment_abbreviation,
                    segment_name_ja,
                    total_amount,
                    item_count,
                    fetched_at
                ) VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                report.consolidation_accounting_unit,
                abbr,
                name,
                data["total"],
                data["count"],
                report.fetched_at
            ))

    def get_segment_data(self, segment_abbreviation: Optional[str] = None) -> List[dict]:
        """
        セグメントデータを取得

        Args:
            segment_abbreviation: セグメント略号（フィルター）

        Returns:
            List[dict]: セグメント損益計算書データ
        """
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        query = "SELECT * FROM segment_profit_and_loss"
        params = []

        if segment_abbreviation:
            query += " WHERE segment_abbreviation = ?"
            params.append(segment_abbreviation)

        query += " ORDER BY fetched_at DESC, segment_abbreviation"

        cursor.execute(query, params)
        results = [dict(row) for row in cursor.fetchall()]
        conn.close()

        return results

    def get_segment_summary(self) -> List[dict]:
        """
        セグメントサマリーを取得

        Returns:
            List[dict]: セグメント要約データ
        """
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute('''
            SELECT * FROM segment_summary
            ORDER BY fetched_at DESC
        ''')

        results = [dict(row) for row in cursor.fetchall()]
        conn.close()

        return results
