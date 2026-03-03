'use client';

import React from 'react';
import { DataMartResult } from '@/types';

interface DataMartResultTableProps {
  results: DataMartResult;
  selectedFields: string[];
}

export default function DataMartResultTable({
  results,
  selectedFields,
}: DataMartResultTableProps) {
  const handleExport = () => {
    if (results.rows.length === 0) {
      alert('エクスポートするデータがありません');
      return;
    }

    // CSVを生成
    const headers = results.columns.map((col) => col.name);
    const csvContent = [
      headers.join(','),
      ...results.rows.map((row) =>
        results.columns
          .map((col) => {
            const value = row[col.id];
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value}"`;
            }
            return value;
          })
          .join(',')
      ),
    ].join('\n');

    // ダウンロード
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `datamart_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatNumber = (value: any): string => {
    if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        return value.toLocaleString('ja-JP');
      } else {
        return value.toLocaleString('ja-JP', { maximumFractionDigits: 2 });
      }
    }
    return String(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">📊 抽出結果</h2>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-orange-500 text-white rounded font-semibold hover:bg-orange-600 text-sm"
        >
          💾 CSV エクスポート
        </button>
      </div>

      {/* データ情報 */}
      <div className="mb-4 p-3 bg-blue-50 rounded text-sm">
        <div className="flex justify-between">
          <span className="text-gray-700">
            <strong>全行数:</strong> {results.totalRows.toLocaleString()}行
          </span>
          <span className="text-gray-700">
            <strong>抽出日時:</strong> {new Date(results.executedAt).toLocaleString('ja-JP')}
          </span>
        </div>
      </div>

      {/* テーブル */}
      {results.rows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                {results.columns.map((col) => (
                  <th key={col.id} className="px-4 py-2 text-left font-bold text-gray-900">
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.rows.slice(0, 20).map((row, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  {results.columns.map((col) => (
                    <td key={`${idx}-${col.id}`} className="px-4 py-2 text-gray-700">
                      {col.type === 'number' ? formatNumber(row[col.id]) : row[col.id]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>データを抽出して結果を表示します</p>
        </div>
      )}

      {/* ページネーション情報 */}
      {results.rows.length > 20 && (
        <div className="mt-4 text-center text-sm text-gray-600">
          先頭20行を表示中 (全{results.totalRows.toLocaleString()}行)
          <br />
          <span className="text-xs">すべてのデータはCSVエクスポートで取得可能です</span>
        </div>
      )}
    </div>
  );
}
