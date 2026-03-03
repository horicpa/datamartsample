'use client';

import { useState } from 'react';
import { useDashboardStore } from '@/lib/store';

export default function InitializeButton() {
  const { loading, initializeSampleData } = useDashboardStore();
  const [initialized, setInitialized] = useState(false);

  const handleInitialize = async () => {
    await initializeSampleData();
    setInitialized(true);
    setTimeout(() => setInitialized(false), 3000);
  };

  return (
    <button
      onClick={handleInitialize}
      disabled={loading}
      className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
        loading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
      }`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">⏳</span> 初期化中...
        </span>
      ) : (
        '📥 サンプルデータを初期化'
      )}
    </button>
  );
}
