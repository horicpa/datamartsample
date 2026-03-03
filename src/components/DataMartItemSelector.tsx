'use client';

import React from 'react';
import { DataMartField } from '@/types';

interface DataItemSelectorProps {
  dimensionFields: DataMartField[];
  measureFields: DataMartField[];
  selectedFields: string[];
  onAddField: (fieldId: string) => void;
  onRemoveField: (fieldId: string) => void;
}

export default function DataItemSelector({
  dimensionFields,
  measureFields,
  selectedFields,
  onAddField,
  onRemoveField,
}: DataItemSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">📋 データ項目選択</h2>
      <p className="text-sm text-gray-600 mb-4">
        利用可能なデータ項目を確認し、必要な項目を選択します
      </p>

      {/* 選択済み項目 */}
      {selectedFields.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 text-sm mb-2">✅ 選択済み項目 ({selectedFields.length})</h3>
          <div className="space-y-2">
            {selectedFields.map((fieldId) => {
              const field = [...dimensionFields, ...measureFields].find((f) => f.id === fieldId);
              if (!field) return null;
              return (
                <div key={fieldId} className="flex items-center justify-between bg-blue-50 p-2 rounded">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{field.name}</span>
                    <span
                      className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        field.type === 'dimension'
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-green-200 text-green-800'
                      }`}
                    >
                      {field.type === 'dimension' ? 'Dimension' : 'Measure'}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveField(fieldId)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dimension */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 text-sm mb-2">🔷 Dimension（切り口）</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {dimensionFields.map((field) => (
            <div key={field.id}>
              <button
                onClick={() => onAddField(field.id)}
                disabled={selectedFields.includes(field.id)}
                className={`w-full text-left p-2 rounded text-sm transition-colors ${
                  selectedFields.includes(field.id)
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-50 text-gray-700 hover:bg-blue-50'
                }`}
              >
                <div className="font-medium">{field.name}</div>
                <div className="text-xs text-gray-500">{field.category}</div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Measure */}
      <div>
        <h3 className="font-semibold text-gray-700 text-sm mb-2">🟢 Measure（数値）</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {measureFields.map((field) => (
            <div key={field.id}>
              <button
                onClick={() => onAddField(field.id)}
                disabled={selectedFields.includes(field.id)}
                className={`w-full text-left p-2 rounded text-sm transition-colors ${
                  selectedFields.includes(field.id)
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-50 text-gray-700 hover:bg-green-50'
                }`}
              >
                <div className="font-medium">{field.name}</div>
                <div className="text-xs text-gray-500">{field.category}</div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
