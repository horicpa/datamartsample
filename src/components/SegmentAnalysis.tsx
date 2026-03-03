'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { SegmentSummary } from '@/types';

interface SegmentAnalysisProps {
  segments: SegmentSummary[];
}

export default function SegmentAnalysis({ segments }: SegmentAnalysisProps) {
  const revenueData = segments.map((seg) => ({
    name: seg.segmentNameJa,
    revenue: Math.round(seg.revenue / 100_000_000 * 10) / 10,
    profitMargin: Math.round(seg.profitMargin * 100) / 100,
  }));

  const formatYAxis = (value: number) => `¥${value}B`;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">💹 セグメント別売上分析</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* セグメント別売上高 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">セグメント別売上高</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip formatter={(value: number) => `¥${value}B`} />
              <Bar dataKey="revenue" fill="#667eea" name="売上高（十億円）" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* セグメント別利益率 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">セグメント別営業利益率</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value: number) => `${value}%`} />
              <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
              <Bar dataKey="profitMargin" fill="#764ba2" name="利益率（%）" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* セグメント別詳細テーブル */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">セグメント別サマリー</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">セグメント</th>
                <th className="px-4 py-3 text-right">売上高</th>
                <th className="px-4 py-3 text-right">売上原価</th>
                <th className="px-4 py-3 text-right">販売費・管理費</th>
                <th className="px-4 py-3 text-right">営業利益</th>
                <th className="px-4 py-3 text-right">利益率</th>
              </tr>
            </thead>
            <tbody>
              {segments.map((segment) => (
                <tr key={segment.segmentAbbreviation} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{segment.segmentNameJa}</td>
                  <td className="px-4 py-3 text-right font-semibold">
                    ¥{(segment.revenue / 100_000_000).toFixed(2)}B
                  </td>
                  <td className="px-4 py-3 text-right">
                    ¥{(segment.costOfSales / 100_000_000).toFixed(2)}B
                  </td>
                  <td className="px-4 py-3 text-right">
                    ¥{(segment.sgAndA / 100_000_000).toFixed(2)}B
                  </td>
                  <td className="px-4 py-3 text-right">
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
      </div>
    </div>
  );
}
