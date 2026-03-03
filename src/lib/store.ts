/**
 * Zustand ストア
 * ダッシュボードの状態管理
 */

import { create } from 'zustand';
import { DashboardData, SegmentProfitLossItem } from '@/types';

interface DashboardStore {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  selectedSegment: string | null;
  segmentDetail: {
    incomeStatement: { code: string; nameJa: string; amount: number }[];
    companyRevenue: { company: string; revenue: number }[];
  } | null;

  // Actions
  fetchDashboardData: () => Promise<void>;
  fetchSegmentDetail: (segmentAbbr: string) => Promise<void>;
  initializeSampleData: () => Promise<void>;
  setSelectedSegment: (segment: string | null) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  data: null,
  loading: false,
  error: null,
  selectedSegment: null,
  segmentDetail: null,

  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const data = await response.json();
      set({ data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchSegmentDetail: async (segmentAbbr: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/segments?abbr=${encodeURIComponent(segmentAbbr)}`);
      if (!response.ok) throw new Error('Failed to fetch segment detail');
      const segmentDetail = await response.json();
      set({ segmentDetail, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  initializeSampleData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/init-sample-data', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to initialize sample data');
      await response.json();
      // サンプルデータ初期化後、ダッシュボードデータを再取得
      const store = useDashboardStore.getState();
      await store.fetchDashboardData();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  setSelectedSegment: (segment: string | null) => {
    set({ selectedSegment: segment });
  },
}));
