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
