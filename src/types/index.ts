/**
 * セグメント損益計算書データモデル
 */

export interface SegmentProfitLossItem {
  id?: number;
  subCategory: string;
  accountCode: string;
  accountNameJa: string;
  companyAbbreviation: string;
  companyNameJa: string;
  segmentAbbreviation: string;
  segmentNameJa: string;
  journalType: 'actual' | 'budget' | 'forecast';
  segmentAmount: number;
  fetchedAt?: Date;
}

export interface SegmentProfitLossReport {
  consolidationAccountingUnit: string;
  segmentProfitAndLossItems: SegmentProfitLossItem[];
  fetchedAt: Date;
}

export interface SegmentSummary {
  segmentAbbreviation: string;
  segmentNameJa: string;
  revenue: number;
  costOfSales: number;
  sgAndA: number;
  operatingIncome: number;
  profitMargin: number;
}

export interface CompanySummary {
  companyAbbreviation: string;
  companyNameJa: string;
  revenue: number;
}

export interface DashboardData {
  totalRecords: number;
  segmentCount: number;
  companyCount: number;
  totalRevenue: number;
  segments: SegmentSummary[];
  lastFetchedAt: Date | null;
}

export interface IncomeStatementLine {
  code: string;
  nameJa: string;
  amount: number;
}

/**
 * データマート用型定義
 */

export interface DataMartField {
  id: string;
  name: string;
  type: 'dimension' | 'measure';
  category: string;
  description: string;
}

export interface QueryCondition {
  fieldId: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'contains';
  value: string | number | string[] | number[];
}

export interface DataMartQuery {
  selectedFields: string[];
  conditions: QueryCondition[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DataMartResult {
  columns: Array<{ id: string; name: string; type: string }>;
  rows: Record<string, any>[];
  totalRows: number;
  executedAt: Date;
}
