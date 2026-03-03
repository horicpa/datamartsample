# セグメント損益計算書データマート - ソースファイル生成スクリプト
# npm install 実行後に、このスクリプトを実行してください

Write-Host "📝 ソースファイルを生成中..."
Write-Host ""

# src/types/index.ts
@'
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
'@ | Out-File -Encoding UTF8 "src\types\index.ts"

Write-Host "✅ src/types/index.ts を作成しました"

# src/lib/sampleData.ts
@'
/**
 * サンプルデータ生成
 * 実際のセグメント損益計算書データを模擬データとして生成
 */

import { SegmentProfitLossReport, SegmentProfitLossItem } from "@/types";

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
    { abbr: "SEG_A", name: "セグメントA（国内事業）" },
    { abbr: "SEG_B", name: "セグメントB（海外事業）" },
    { abbr: "SEG_C", name: "セグメントC（新規事業）" },
  ];

  const accounts: Account[] = [
    { code: "1000", nameJa: "売上高", category: "revenue" },
    { code: "1100", nameJa: "売上原価", category: "cost_of_sales" },
    { code: "1200", nameJa: "販売費及び一般管理費", category: "sg_and_a" },
    { code: "1300", nameJa: "営業利益", category: "operating_income" },
    { code: "2100", nameJa: "営業外収益", category: "non_operating_income" },
    { code: "2200", nameJa: "営業外費用", category: "non_operating_expense" },
    { code: "2300", nameJa: "税金等調整前当期利益", category: "income_before_tax" },
  ];

  const companies: Company[] = [
    { abbr: "HQ", nameJa: "本社" },
    { abbr: "SUB1", nameJa: "子会社A" },
    { abbr: "SUB2", nameJa: "子会社B" },
  ];

  const items: SegmentProfitLossItem[] = [];
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - daysAgo);

  for (const segment of segments) {
    for (const account of accounts) {
      for (const company of companies) {
        const baseAmount = 10_000_000; // 1000万円

        let baseMultiplier = 1;
        if (segment.abbr === "SEG_A") {
          baseMultiplier = 2.5; // 国内事業
        } else if (segment.abbr === "SEG_B") {
          baseMultiplier = 1.8; // 海外事業
        } else {
          baseMultiplier = 0.8; // 新規事業
        }

        let amount = baseAmount * baseMultiplier;

        switch (account.category) {
          case "revenue":
            // そのままベース金額
            break;
          case "cost_of_sales":
            amount = baseAmount * baseMultiplier * -0.6;
            break;
          case "sg_and_a":
            amount = baseAmount * baseMultiplier * -0.15;
            break;
          case "operating_income":
            amount = baseAmount * baseMultiplier * 0.25;
            break;
          case "non_operating_income":
            amount = baseAmount * baseMultiplier * 0.05;
            break;
          case "non_operating_expense":
            amount = baseAmount * baseMultiplier * -0.03;
            break;
          case "income_before_tax":
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
          journalType: "actual",
          segmentAmount: amount,
          fetchedAt: baseDate,
        };

        items.push(item);
      }
    }
  }

  return {
    consolidationAccountingUnit: `決算単位$${unitId}`,
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
'@ | Out-File -Encoding UTF8 "src\lib\sampleData.ts"

Write-Host "✅ src/lib/sampleData.ts を作成しました"

Write-Host ""
Write-Host "次のステップ:"
Write-Host "1. src/lib/datamart.ts のファイル内容をコピーして作成"
Write-Host "2. src/lib/store.ts のファイル内容をコピーして作成"
Write-Host "3. src/app/ 内のファイルをコピーして作成"
Write-Host "4. src/components/ 内のファイルをコピーして作成"
Write-Host "5. src/__tests__/ 内のテストファイルをコピーして作成"
Write-Host ""
Write-Host "詳細は README.md を参照してください"
