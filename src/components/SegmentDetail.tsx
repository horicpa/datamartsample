'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useDashboardStore } from '@/lib/store';
import { SegmentSummary } from '@/types';

interface SegmentDetailProps {
  segments: SegmentSummary[];
  selectedSegment: string;
  onSegmentChange: (segment: string) => void;
}

const COLORS = ['#667eea', '#764ba2', '#f093fb'];

export default function SegmentDetail({
  segments,
  selectedSegment,
  onSegmentChange,
}: SegmentDetailProps) {
  const { segmentDetail, loading } = useDashboardStore();

  const selectedSegmentData = segments.find(
    (s) => s.segmentAbbreviation === selectedSegment
  );

  if (!selectedSegmentData) {
    return null;
  }

  const incomeStatementData = segmentDetail?.incomeStatement || [];
  const companyRevenueData = segmentDetail?.companyRevenue || [];

  // 損益計算書データの整形
  const incomeChartData = incomeStatementData.map((item) => ({
    code: item.code,
    name: item.nameJa,
    amount: Math.round(item.amount / 100_000_000 * 100) / 100,
  }));

  // 会社別売上のパイチャートデータ
  const pieData = companyRevenueData.map((item) => ({
    name: item.company,
    value: Math.round(item.revenue / 100_000_000 * 100) / 100,
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🔍 セグメント別詳細分析</h2>

      {/* セグメント選択 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          分析対象セグメントを選択
        </label>
        <div className="flex gap-2 flex-wrap">
          {segments.map((segment) => (
            <button
              key={segment.segmentAbbreviation}
              onClick={() => onSegmentChange(segment.segmentAbbreviation)}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                selectedSegment === segment.segmentAbbreviation
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {segment.segmentNameJa}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* 損益計算書フロー */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {selectedSegmentData.segmentNameJa} - 損益計算書
            </h3>
            <div className="space-y-2">
              {incomeChartData.map((item, index) => (
                <div key={item.code} className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">{item.name}</span>
                    <span
                      className={`font-bold ${
                        item.amount >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      ¥{Math.abs(item.amount).toFixed(2)}B
                    </span>
                  </div>
                  {index === incomeChartData.length - 1 && (
                    <div className="text-sm text-gray-500 mt-1">
                      {item.amount >= 0 ? '収益' : '費用'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 会社別売上比率 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {selectedSegmentData.segmentNameJa} - 会社別売上比率
            </h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ¥${value}B`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `¥${value}B`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-gray-500">
                会社別データはありません
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
