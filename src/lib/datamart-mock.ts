/**
 * データマート用ダミーデータ
 */

import { DataMartField, DataMartResult } from '@/types';

// 利用可能なデータ項目
export const AVAILABLE_FIELDS: DataMartField[] = [
  // Dimension（切り口）
  { id: 'segment', name: 'セグメント', type: 'dimension', category: '組織', description: '事業部門別の切り口' },
  { id: 'company', name: '会社', type: 'dimension', category: '組織', description: 'グループ内の法人' },
  { id: 'department', name: '部門', type: 'dimension', category: '組織', description: '部門別分類' },
  { id: 'product', name: '製品', type: 'dimension', category: 'ビジネス', description: '製品・サービス別' },
  { id: 'region', name: '地域', type: 'dimension', category: 'ビジネス', description: '地域別分類' },
  { id: 'accountCode', name: '勘定科目', type: 'dimension', category: '会計', description: '勘定科目コード' },
  { id: 'journalType', name: 'データ種別', type: 'dimension', category: '会計', description: '実績/予算/予測' },
  { id: 'period', name: '期間', type: 'dimension', category: '時間', description: '月次/四半期/年次' },

  // Measure（数値）
  { id: 'revenue', name: '売上高', type: 'measure', category: '売上', description: '売上高（円）' },
  { id: 'costOfSales', name: '売上原価', type: 'measure', category: 'コスト', description: '売上原価（円）' },
  { id: 'grossProfit', name: '売上総利益', type: 'measure', category: '利益', description: '売上総利益（円）' },
  { id: 'sgAndA', name: '販管費', type: 'measure', category: 'コスト', description: '販売管理費（円）' },
  { id: 'operatingIncome', name: '営業利益', type: 'measure', category: '利益', description: '営業利益（円）' },
  { id: 'profitMargin', name: '利益率', type: 'measure', category: 'KPI', description: '利益率（%）' },
  { id: 'costRatio', name: 'コスト比率', type: 'measure', category: 'KPI', description: 'コスト比率（%）' },
];

// ダミーのセグメント、会社、製品データ
export const SEGMENT_OPTIONS = [
  'デジタルソリューション',
  'クラウドサービス',
  'コンサルティング',
  'システム開発',
];

export const COMPANY_OPTIONS = [
  '本社',
  '東京営業所',
  '大阪営業所',
  '福岡営業所',
];

export const PRODUCT_OPTIONS = [
  'プロダクトA',
  'プロダクトB',
  'プロダクトC',
  'コンサルティングサービス',
  'サポートサービス',
];

export const REGION_OPTIONS = [
  '関東',
  '関西',
  '中部',
  '九州',
  '北海道',
];

export const PERIOD_OPTIONS = [
  '2024年1月',
  '2024年2月',
  '2024年3月',
  '2024年4月',
  '2024年5月',
  '2024年6月',
];

// ダミーデータ生成関数
export function generateMockData(): DataMartResult {
  const rows = [];

  for (let i = 0; i < 50; i++) {
    const revenue = Math.random() * 100_000_000 + 10_000_000;
    const costRatio = Math.random() * 0.4 + 0.3;
    const costOfSales = revenue * costRatio;
    const sgAndA = revenue * (Math.random() * 0.3 + 0.2);
    const operatingIncome = revenue - costOfSales - sgAndA;
    const profitMargin = (operatingIncome / revenue) * 100;

    rows.push({
      segment: SEGMENT_OPTIONS[Math.floor(Math.random() * SEGMENT_OPTIONS.length)],
      company: COMPANY_OPTIONS[Math.floor(Math.random() * COMPANY_OPTIONS.length)],
      department: ['営業部', '企画部', '技術部'][Math.floor(Math.random() * 3)],
      product: PRODUCT_OPTIONS[Math.floor(Math.random() * PRODUCT_OPTIONS.length)],
      region: REGION_OPTIONS[Math.floor(Math.random() * REGION_OPTIONS.length)],
      accountCode: `1000${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`,
      journalType: ['actual', 'budget', 'forecast'][Math.floor(Math.random() * 3)],
      period: PERIOD_OPTIONS[Math.floor(Math.random() * PERIOD_OPTIONS.length)],
      revenue: Math.round(revenue),
      costOfSales: Math.round(costOfSales),
      grossProfit: Math.round(revenue - costOfSales),
      sgAndA: Math.round(sgAndA),
      operatingIncome: Math.round(operatingIncome),
      profitMargin: parseFloat(profitMargin.toFixed(2)),
      costRatio: parseFloat((costRatio * 100).toFixed(2)),
    });
  }

  return {
    columns: [
      { id: 'segment', name: 'セグメント', type: 'string' },
      { id: 'company', name: '会社', type: 'string' },
      { id: 'product', name: '製品', type: 'string' },
      { id: 'period', name: '期間', type: 'string' },
      { id: 'revenue', name: '売上高', type: 'number' },
      { id: 'costOfSales', name: '売上原価', type: 'number' },
      { id: 'operatingIncome', name: '営業利益', type: 'number' },
      { id: 'profitMargin', name: '利益率（%）', type: 'number' },
    ],
    rows,
    totalRows: rows.length,
    executedAt: new Date(),
  };
}
