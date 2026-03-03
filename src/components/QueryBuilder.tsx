'use client';

import React, { useState } from 'react';
import { DataMartField, QueryCondition } from '@/types';
import {
  SEGMENT_OPTIONS,
  COMPANY_OPTIONS,
  PRODUCT_OPTIONS,
  REGION_OPTIONS,
  PERIOD_OPTIONS,
} from '@/lib/datamart-mock';

interface QueryBuilderProps {
  fields: DataMartField[];
  conditions: QueryCondition[];
  onAddCondition: (condition: QueryCondition) => void;
  onRemoveCondition: (index: number) => void;
  onExecuteQuery: () => void;
  isExecuting: boolean;
}

export default function QueryBuilder({
  fields,
  conditions,
  onAddCondition,
  onRemoveCondition,
  onExecuteQuery,
  isExecuting,
}: QueryBuilderProps) {
  const [newCondition, setNewCondition] = useState<Partial<QueryCondition>>({
    operator: '=',
  });

  const dimensionFields = fields.filter((f) => f.type === 'dimension');

  const getOptionsForField = (fieldId: string) => {
    switch (fieldId) {
      case 'segment':
        return SEGMENT_OPTIONS;
      case 'company':
        return COMPANY_OPTIONS;
      case 'product':
        return PRODUCT_OPTIONS;
      case 'region':
        return REGION_OPTIONS;
      case 'period':
        return PERIOD_OPTIONS;
      default:
        return [];
    }
  };

  const handleAddCondition = () => {
    if (newCondition.fieldId && newCondition.value !== undefined) {
      onAddCondition(newCondition as QueryCondition);
      setNewCondition({ operator: '=' });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">🔍 抽出条件</h2>
      <p className="text-sm text-gray-600 mb-4">
        データを絞り込む条件を設定します
      </p>

      {/* 追加済み条件 */}
      {conditions.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 text-sm mb-2">✓ 適用中の条件</h3>
          <div className="space-y-2">
            {conditions.map((condition, index) => {
              const field = fields.find((f) => f.id === condition.fieldId);
              return (
                <div key={index} className="flex items-center justify-between bg-yellow-50 p-2 rounded text-sm">
                  <div>
                    <span className="font-medium text-gray-900">{field?.name}</span>
                    <span className="text-gray-600 mx-1">{condition.operator}</span>
                    <span className="text-gray-700">
                      {Array.isArray(condition.value) ? condition.value.join(', ') : condition.value}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveCondition(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 新規条件追加フォーム */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold text-gray-700 text-sm mb-3">➕ 条件を追加</h3>

        {/* フィールド選択 */}
        <div className="mb-3">
          <label className="text-xs font-semibold text-gray-600 block mb-1">フィールド</label>
          <select
            value={newCondition.fieldId || ''}
            onChange={(e) => setNewCondition({ ...newCondition, fieldId: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          >
            <option value="">選択してください</option>
            {dimensionFields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.name} ({field.category})
              </option>
            ))}
          </select>
        </div>

        {/* オペレータ選択 */}
        <div className="mb-3">
          <label className="text-xs font-semibold text-gray-600 block mb-1">演算子</label>
          <select
            value={newCondition.operator || '='}
            onChange={(e) => setNewCondition({ ...newCondition, operator: e.target.value as any })}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          >
            <option value="=">=</option>
            <option value="!=">!=</option>
            <option value=">">&gt;</option>
            <option value="<">&lt;</option>
            <option value=">=">&gt;=</option>
            <option value="<=">&lt;=</option>
            <option value="in">IN</option>
            <option value="contains">contains</option>
          </select>
        </div>

        {/* 値入力 */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-600 block mb-1">値</label>
          {newCondition.fieldId && getOptionsForField(newCondition.fieldId).length > 0 ? (
            <select
              value={newCondition.value || ''}
              onChange={(e) => setNewCondition({ ...newCondition, value: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="">選択してください</option>
              {getOptionsForField(newCondition.fieldId).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={newCondition.value || ''}
              onChange={(e) => setNewCondition({ ...newCondition, value: e.target.value })}
              placeholder="値を入力"
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          )}
        </div>

        <button
          onClick={handleAddCondition}
          disabled={!newCondition.fieldId || newCondition.value === undefined}
          className="w-full py-2 bg-blue-500 text-white rounded text-sm font-semibold hover:bg-blue-600 disabled:bg-gray-300"
        >
          条件を追加
        </button>
      </div>

      {/* 実行ボタン */}
      <button
        onClick={onExecuteQuery}
        disabled={isExecuting}
        className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded font-bold hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-400 transition-all"
      >
        {isExecuting ? '実行中...' : '🚀 データを抽出'}
      </button>
    </div>
  );
}
