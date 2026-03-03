/**
 * サンプルデータ生成
 * 実際のセグメント損益計算書データを模擬データとして生成
 */

import { SegmentProfitLossReport, SegmentProfitLossItem } from '@/types';

export interface Segment {
  abbr: string;
  name: string;
}

export interface Account {
  code: string;
  nameJa: string;
  category: string;
}

export interface Company {
  abbr: string;
  nameJa: string;
}

/**
 * サンプルセグメント損益計算書を生成
 */
export function generateSampleReport(
  unitId: number = 1,
  daysAgo: number = 0
): SegmentProfitLossReport {
  const segments: Segment[] = [
    { abbr: 'SEG_A', name: 'セグメントA（国内事業）' },
    { abbr: 'SEG_B', name: 'セグメントB（海外事業）' },
    { abbr: 'SEG_C', name: 'セグメントC（新規事業）' },
  ];

  const accounts: Account[] = [
    { code: '1000', nameJa: '売上高', category: 'revenue' },
    { code: '1100', nameJa: '売上原価', category: 'cost_of_sales' },
    { code: '1200', nameJa: '販売費及び一般管理費', category: 'sg_and_a' },
    { code: '1300', nameJa: '営業利益', category: 'operating_income' },
    { code: '2100', nameJa: '営業外収益', category: 'non_operating_income' },
    { code: '2200', nameJa: '営業外費用', category: 'non_operating_expense' },
    { code: '2300', nameJa: '税金等調整前当期利益', category: 'income_before_tax' },
  ];

  const companies: Company[] = [
    { abbr: 'HQ', nameJa: '本社' },
    { abbr: 'SUB1', nameJa: '子会社A' },
    { abbr: 'SUB2', nameJa: '子会社B' },
  ];

  const items: SegmentProfitLossItem[] = [];
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - daysAgo);

  for (const segment of segments) {
    for (const account of accounts) {
      for (const company of companies) {
        const baseAmount = 10_000_000; // 1000万円

        let baseMultiplier = 1;
        if (segment.abbr === 'SEG_A') {
          baseMultiplier = 2.5; // 国内事業
        } else if (segment.abbr === 'SEG_B') {
          baseMultiplier = 1.8; // 海外事業
        } else {
          baseMultiplier = 0.8; // 新規事業
        }

        let amount = baseAmount * baseMultiplier;

        switch (account.category) {
          case 'revenue':
            // そのままベース金額
            break;
          case 'cost_of_sales':
            amount = baseAmount * baseMultiplier * -0.6;
            break;
          case 'sg_and_a':
            amount = baseAmount * baseMultiplier * -0.15;
            break;
          case 'operating_income':
            amount = baseAmount * baseMultiplier * 0.25;
            break;
          case 'non_operating_income':
            amount = baseAmount * baseMultiplier * 0.05;
            break;
          case 'non_operating_expense':
            amount = baseAmount * baseMultiplier * -0.03;
            break;
          case 'income_before_tax':
            amount = baseAmount * baseMultiplier * 0.27;
            break;
        }

        // ランダム変動（±10%）
        const variance = Math.random() * 0.2 + 0.9;
        amount = amount * variance;

        const item: SegmentProfitLossItem = {
          subCategory: account.category,
          accountCode: account.code,
          accountNameJa: account.nameJa,
          companyAbbreviation: company.abbr,
          companyNameJa: company.nameJa,
          segmentAbbreviation: segment.abbr,
          segmentNameJa: segment.name,
          journalType: 'actual',
          segmentAmount: amount,
          fetchedAt: baseDate,
        };

        items.push(item);
      }
    }
  }

  return {
    consolidationAccountingUnit: `決算単位${unitId}`,
    segmentProfitAndLossItems: items,
    fetchedAt: baseDate,
  };
}

/**
 * 複数月分のサンプルレポートを生成
 */
export function generateMultipleSampleReports(
  unitId: number = 1,
  numMonths: number = 12
): SegmentProfitLossReport[] {
  const reports: SegmentProfitLossReport[] = [];

  for (let month = 0; month < numMonths; month++) {
    const report = generateSampleReport(unitId, month * 30);
    reports.push(report);
  }

  return reports;
}
