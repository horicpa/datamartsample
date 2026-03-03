'use client';

import { useState } from 'react';
import { SegmentSummary } from '@/types';

interface DataTableProps {
  segments: SegmentSummary[];
}

export default function DataTable({ segments }: DataTableProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'description'>('summary');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 詳細データ</h2>

      {/* タブ */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'summary'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          セグメント別サマリー
        </button>
        <button
          onClick={() => setActiveTab('description')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'description'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          できることの説明
        </button>
      </div>

      {/* サマリータブ */}
      {activeTab === 'summary' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">セグメント</th>
                <th className="px-4 py-3 text-right font-semibold">売上高</th>
                <th className="px-4 py-3 text-right font-semibold">売上原価</th>
                <th className="px-4 py-3 text-right font-semibold">販売費・管理費</th>
                <th className="px-4 py-3 text-right font-semibold">営業利益</th>
                <th className="px-4 py-3 text-right font-semibold">利益率</th>
              </tr>
            </thead>
            <tbody>
              {segments.map((segment) => (
                <tr key={segment.segmentAbbreviation} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{segment.segmentNameJa}</td>
                  <td className="px-4 py-3 text-right">
                    ¥{(segment.revenue / 100_000_000).toFixed(2)}B
                  </td>
                  <td className="px-4 py-3 text-right">
                    ¥{(segment.costOfSales / 100_000_000).toFixed(2)}B
                  </td>
                  <td className="px-4 py-3 text-right">
                    ¥{(segment.sgAndA / 100_000_000).toFixed(2)}B
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    ¥{(segment.operatingIncome / 100_000_000).toFixed(2)}B
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-600">
                    {segment.profitMargin.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 説明タブ */}
      {activeTab === 'description' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">📊 セグメント別採算分析</h3>
            <ul className="text-blue-700 space-y-1">
              <li>✓ セグメント別の売上・利益を可視化し、各セグメントの経営状況を把握</li>
              <li>✓ セグメント間の成長率・利益率を比較し、相対的なパフォーマンスを評価</li>
              <li>✓ セグメント別の経営指標を詳細に分析し、戦略的な経営判断をサポート</li>
            </ul>
          </div>
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
            <h3 className="text-lg font-bold text-green-900 mb-2">🏢 グループ内会社分析</h3>
            <ul className="text-green-700 space-y-1">
              <li>✓ 各セグメント内での会社別売上比率を表示し、子会社の貢献度を可視化</li>
              <li>✓ グループ全体の統合経営管理を実現し、全社的な最適化を推進</li>
              <li>✓ 連結決算データの詳細分析を実施し、グループ全体の経営状況を把握</li>
            </ul>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6">
            <h3 className="text-lg font-bold text-yellow-900 mb-2">⏱️ 時系列分析への拡張</h3>
            <ul className="text-yellow-700 space-y-1">
              <li>✓ 複数月データの蓄積で月次推移分析を実施し、トレンドを把握</li>
              <li>✓ 売上・利益のトレンド分析を実施し、将来予測をサポート</li>
              <li>✓ セグメント別の変動分析を実施し、変動要因を特定</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
