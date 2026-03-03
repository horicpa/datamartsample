'use client';

import React, { useState } from 'react';
import { DataMartField, QueryCondition } from '@/types';
import { AVAILABLE_FIELDS, generateMockData } from '@/lib/datamart-mock';
import DataItemSelector from './DataMartItemSelector';
import QueryBuilder from './QueryBuilder';
import DataMartResultTable from './DataMartResultTable';

export default function DataMartBuilder() {
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'segment',
    'company',
    'product',
    'period',
    'revenue',
    'operatingIncome',
  ]);
  const [conditions, setConditions] = useState<QueryCondition[]>([]);
  const [results, setResults] = useState(generateMockData());
  const [isExecuting, setIsExecuting] = useState(false);

  const handleAddField = (fieldId: string) => {
    if (!selectedFields.includes(fieldId)) {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };

  const handleRemoveField = (fieldId: string) => {
    setSelectedFields(selectedFields.filter((f) => f !== fieldId));
  };

  const handleAddCondition = (condition: QueryCondition) => {
    setConditions([...conditions, condition]);
  };

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleExecuteQuery = async () => {
    setIsExecuting(true);
    // ダミー実行（実際にはAPIを呼び出す）
    setTimeout(() => {
      const mockData = generateMockData();
      // フィールド選択に基づいてカラムをフィルタ
      const filteredData = {
        ...mockData,
        columns: mockData.columns.filter((col) => selectedFields.includes(col.id)),
        rows: mockData.rows.map((row) => {
          const filtered: Record<string, any> = {};
          selectedFields.forEach((fieldId) => {
            if (fieldId in row) {
              filtered[fieldId] = row[fieldId as keyof typeof row];
            }
          });
          return filtered;
        }),
      };
      setResults(filteredData);
      setIsExecuting(false);
    }, 800);
  };

  const dimensionFields = AVAILABLE_FIELDS.filter((f) => f.type === 'dimension');
  const measureFields = AVAILABLE_FIELDS.filter((f) => f.type === 'measure');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 クラウド経営管理データマート</h1>
          <p className="text-gray-600">必要なデータ項目を選択して、条件を指定し、分析データを抽出します</p>
        </div>

        {/* 3パネルレイアウト */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* 左パネル：データ項目選択 */}
          <div className="lg:col-span-3">
            <DataItemSelector
              dimensionFields={dimensionFields}
              measureFields={measureFields}
              selectedFields={selectedFields}
              onAddField={handleAddField}
              onRemoveField={handleRemoveField}
            />
          </div>

          {/* 中央パネル：抽出条件 */}
          <div className="lg:col-span-3">
            <QueryBuilder
              fields={AVAILABLE_FIELDS}
              conditions={conditions}
              onAddCondition={handleAddCondition}
              onRemoveCondition={handleRemoveCondition}
              onExecuteQuery={handleExecuteQuery}
              isExecuting={isExecuting}
            />
          </div>

          {/* 右パネル：データ表示 */}
          <div className="lg:col-span-6">
            <DataMartResultTable results={results} selectedFields={selectedFields} />
          </div>
        </div>

        {/* 使用例 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2">✅ できること</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 複数のデータ項目を自由に選択</li>
              <li>• セグメント・期間・製品で絞り込み</li>
              <li>• リアルタイムでデータを抽出</li>
            </ul>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-bold text-green-900 mb-2">📥 データ項目構成</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• <strong>Dimension</strong>: 切り口（セグメント等）</li>
              <li>• <strong>Measure</strong>: 数値データ（売上等）</li>
              <li>• 自由に組み合わせ可能</li>
            </ul>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-bold text-orange-900 mb-2">💾 エクスポート</h3>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• CSV形式でダウンロード</li>
              <li>• Excel分析に対応</li>
              <li>• 外部システムと連携可能</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
