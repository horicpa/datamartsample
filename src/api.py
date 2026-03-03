"""
MoneyForward 連結会計API クライアント
セグメント損益計算書データ取得
"""

import os
import requests
from typing import Dict, Optional, List
from dataclasses import asdict
from datetime import datetime

from models import SegmentProfitLossItem, SegmentProfitLossReport


class MoneyForwardAPIClient:
    """MoneyForward 連結会計API クライアント"""

    BASE_URL = "https://public-api.consolidated-accounting.moneyforward.com/api/v1"

    def __init__(self, api_token: Optional[str] = None):
        """
        初期化

        Args:
            api_token: APIトークン（環境変数から取得可能）
        """
        self.api_token = api_token or os.getenv("MONEYFORWARD_API_TOKEN")
        if not self.api_token:
            raise ValueError("MONEYFORWARD_API_TOKEN environment variable not set")

        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        })

    def get_segment_profit_and_loss_detail(self, unit_id: int) -> Optional[SegmentProfitLossReport]:
        """
        セグメント損益計算書詳細を取得

        Args:
            unit_id: 連結決算単位ID

        Returns:
            SegmentProfitLossReport: セグメント損益計算書レポート
        """
        endpoint = f"{self.BASE_URL}/reports/segment_profit_and_loss/{unit_id}/detail"

        try:
            response = self.session.get(endpoint)
            response.raise_for_status()

            data = response.json()
            return self._parse_response(data)

        except requests.exceptions.RequestException as e:
            print(f"API Error: {e}")
            return None

    def _parse_response(self, data: Dict) -> SegmentProfitLossReport:
        """
        APIレスポンスをパース

        Args:
            data: APIレスポンスデータ

        Returns:
            SegmentProfitLossReport: パース済みレポート
        """
        items = []

        for item_data in data.get("segment_profit_and_loss_items", []):
            item = SegmentProfitLossItem(
                sub_category=item_data.get("sub_category", ""),
                account_code=item_data.get("account_code", ""),
                account_name_ja=item_data.get("account_name_ja", ""),
                company_abbreviation=item_data.get("company_abbreviation", ""),
                company_name_ja=item_data.get("company_name_ja", ""),
                segment_abbreviation=item_data.get("segment_abbreviation", ""),
                segment_name_ja=item_data.get("segment_name_ja", ""),
                journal_type=item_data.get("journal_type", ""),
                segment_amount=float(item_data.get("segment_amount", 0))
            )
            items.append(item)

        return SegmentProfitLossReport(
            consolidation_accounting_unit=data.get("consolidation_accounting_unit", ""),
            segment_profit_and_loss_items=items,
            fetched_at=datetime.now()
        )
