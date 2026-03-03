'use client';

import React, { useEffect } from 'react';
import { useDashboardStore } from '@/lib/store';
import MetricsCard from './MetricsCard';
import SegmentAnalysis from './SegmentAnalysis';
import SegmentDetail from './SegmentDetail';
import DataTable from './DataTable';
import InitializeButton from './InitializeButton';

export default function Dashboard() {
  const {
    data,
    loading,
    error,
    selectedSegment,
    fetchDashboardData,
    fetchSegmentDetail,
    setSelectedSegment,
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (selectedSegment) {
      fetchSegmentDetail(selectedSegment);
    }
  }, [selectedSegment, fetchSegmentDetail]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700">エラー: {error}</p>
          <p className="text-red-600 mt-2">サンプルデータを初期化してください</p>
        </div>
        <InitializeButton />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-700">データがありません</p>
          <p className="text-yellow-600 mt-2">サンプルデータを初期化してください</p>
        </div>
        <InitializeButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📊 セグメント損益計算書データマート
          </h1>
          <p className="text-gray-600">経営管理向けの統合データマート - セグメント別損益分析</p>
        </div>

        {/* 初期化ボタン */}
        <div className="mb-8">
          <InitializeButton />
        </div>

        {/* メトリクスカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="総レコード数"
            value={data.totalRecords.toLocaleString()}
            description="蓄積されているデータレコードの総数"
            icon="📈"
            color="blue"
          />
          <MetricsCard
            title="セグメント数"
            value={data.segmentCount.toString()}
            description="識別されているセグメント数"
            icon="🎯"
            color="purple"
          />
          <MetricsCard
            title="会社数"
            value={data.companyCount.toString()}
            description="グループ内の法人数"
            icon="🏢"
            color="green"
          />
          <MetricsCard
            title="売上高合計"
            value={`¥${(data.totalRevenue / 100_000_000).toFixed(1)}B`}
            description="全セグメント・全会社の売上高合計"
            icon="💹"
            color="orange"
          />
        </div>

        {/* セグメント別売上分析 */}
        <SegmentAnalysis segments={data.segments} />

        {/* セグメント選択と詳細分析 */}
        {selectedSegment && data.segments && (
          <SegmentDetail
            segments={data.segments}
            selectedSegment={selectedSegment}
            onSegmentChange={setSelectedSegment}
          />
        )}

        {!selectedSegment && data.segments && data.segments.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🔍 セグメント別詳細分析</h2>
            <p className="text-gray-600 mb-4">
              下記からセグメントを選択して詳細分析を表示します
            </p>
            <div className="flex gap-2 flex-wrap">
              {data.segments.map((segment) => (
                <button
                  key={segment.segmentAbbreviation}
                  onClick={() => setSelectedSegment(segment.segmentAbbreviation)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors"
                >
                  {segment.segmentNameJa}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 詳細データテーブル */}
        <DataTable segments={data.segments} />

        {/* できることの説明 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">📊 セグメント別採算分析</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• セグメント別の売上・利益を可視化</li>
              <li>• セグメント間の成長率・利益率を比較</li>
              <li>• セグメント別の経営指標を分析</li>
            </ul>
          </div>
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
            <h3 className="text-lg font-bold text-green-900 mb-2">🏢 グループ内会社分析</h3>
            <ul className="text-green-700 text-sm space-y-1">
              <li>• 各セグメント内での会社別売上比率</li>
              <li>• グループ全体の統合経営管理</li>
              <li>• 連結決算データの詳細分析</li>
            </ul>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6">
            <h3 className="text-lg font-bold text-yellow-900 mb-2">⏱️ 時系列分析への拡張</h3>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• 複数月データの蓄積で月次推移分析</li>
              <li>• 売上・利益のトレンド分析</li>
              <li>• セグメント別の変動分析</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
