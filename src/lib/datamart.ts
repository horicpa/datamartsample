/**
 * セグメント損益計算書データマート
 * better-sqlite3を使用してSQLiteに永続化
 */

import Database from 'better-sqlite3';
import path from 'path';
import {
  SegmentProfitLossItem,
  SegmentProfitLossReport,
  SegmentSummary,
  DashboardData,
} from '@/types';

export class SegmentDataMart {
  private db: Database.Database;

  constructor(dbPath: string = 'segment_datamart.db') {
    this.db = new Database(dbPath);
    this.initializeDatabase();
  }

  /**
   * データベースを初期化
   */
  private initializeDatabase(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS segment_profit_and_loss (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sub_category TEXT NOT NULL,
        account_code TEXT NOT NULL,
        account_name_ja TEXT NOT NULL,
        company_abbreviation TEXT NOT NULL,
        company_name_ja TEXT NOT NULL,
        segment_abbreviation TEXT NOT NULL,
        segment_name_ja TEXT NOT NULL,
        journal_type TEXT NOT NULL,
        segment_amount REAL NOT NULL,
        fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_segment_abbr ON segment_profit_and_loss(segment_abbreviation);
      CREATE INDEX IF NOT EXISTS idx_account_code ON segment_profit_and_loss(account_code);
      CREATE INDEX IF NOT EXISTS idx_company_abbr ON segment_profit_and_loss(company_abbreviation);
    `);
  }

  /**
   * レポートをデータベースに保存
   */
  storeReport(report: SegmentProfitLossReport): boolean {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO segment_profit_and_loss (
          sub_category, account_code, account_name_ja, company_abbreviation,
          company_name_ja, segment_abbreviation, segment_name_ja, journal_type,
          segment_amount, fetched_at
        ) VALUES (
          @subCategory, @accountCode, @accountNameJa, @companyAbbreviation,
          @companyNameJa, @segmentAbbreviation, @segmentNameJa, @journalType,
          @segmentAmount, @fetchedAt
        )
      `);

      const transaction = this.db.transaction(() => {
        for (const item of report.segmentProfitAndLossItems) {
          stmt.run({
            subCategory: item.subCategory,
            accountCode: item.accountCode,
            accountNameJa: item.accountNameJa,
            companyAbbreviation: item.companyAbbreviation,
            companyNameJa: item.companyNameJa,
            segmentAbbreviation: item.segmentAbbreviation,
            segmentNameJa: item.segmentNameJa,
            journalType: item.journalType,
            segmentAmount: item.segmentAmount,
            fetchedAt: report.fetchedAt.toISOString(),
          });
        }
      });

      transaction();
      return true;
    } catch (error) {
      console.error('Failed to store report:', error);
      return false;
    }
  }

  /**
   * すべてのセグメント損益データを取得
   */
  getSegmentData(
    segmentAbbreviation?: string
  ): SegmentProfitLossItem[] {
    let query = 'SELECT * FROM segment_profit_and_loss ORDER BY fetched_at DESC, segment_abbreviation, account_code';
    const params: Record<string, any> = {};

    if (segmentAbbreviation) {
      query = `SELECT * FROM segment_profit_and_loss WHERE segment_abbreviation = @segmentAbbreviation ORDER BY fetched_at DESC, account_code`;
      params.segmentAbbreviation = segmentAbbreviation;
    }

    const stmt = this.db.prepare(query);
    const rows = segmentAbbreviation ? stmt.all(params) : stmt.all();

    return (rows as any[]).map((row) => ({
      id: row.id,
      subCategory: row.sub_category,
      accountCode: row.account_code,
      accountNameJa: row.account_name_ja,
      companyAbbreviation: row.company_abbreviation,
      companyNameJa: row.company_name_ja,
      segmentAbbreviation: row.segment_abbreviation,
      segmentNameJa: row.segment_name_ja,
      journalType: row.journal_type,
      segmentAmount: row.segment_amount,
      fetchedAt: new Date(row.fetched_at),
    }));
  }

  /**
   * セグメント別サマリーを取得
   */
  getSegmentSummary(): SegmentSummary[] {
    const summaryQuery = `
      SELECT
        segment_abbreviation,
        segment_name_ja,
        SUM(CASE WHEN account_code = '1000' THEN segment_amount ELSE 0 END) as revenue,
        SUM(CASE WHEN account_code = '1100' THEN segment_amount ELSE 0 END) as cost_of_sales,
        SUM(CASE WHEN account_code = '1200' THEN segment_amount ELSE 0 END) as sg_and_a,
        SUM(CASE WHEN account_code = '1300' THEN segment_amount ELSE 0 END) as operating_income
      FROM segment_profit_and_loss
      GROUP BY segment_abbreviation, segment_name_ja
      ORDER BY revenue DESC
    `;

    const stmt = this.db.prepare(summaryQuery);
    const rows = stmt.all() as any[];

    return rows.map((row) => ({
      segmentAbbreviation: row.segment_abbreviation,
      segmentNameJa: row.segment_name_ja,
      revenue: row.revenue || 0,
      costOfSales: row.cost_of_sales || 0,
      sgAndA: row.sg_and_a || 0,
      operatingIncome: row.operating_income || 0,
      profitMargin: row.revenue !== 0 ? (row.operating_income / row.revenue) * 100 : 0,
    }));
  }

  /**
   * ダッシュボード用データを取得
   */
  getDashboardData(): DashboardData {
    const countQuery = `
      SELECT
        COUNT(*) as total_records,
        COUNT(DISTINCT segment_abbreviation) as segment_count,
        COUNT(DISTINCT company_abbreviation) as company_count,
        SUM(CASE WHEN account_code = '1000' THEN segment_amount ELSE 0 END) as total_revenue,
        MAX(fetched_at) as last_fetched_at
      FROM segment_profit_and_loss
    `;

    const stmt = this.db.prepare(countQuery);
    const result = stmt.get() as any;

    const segments = this.getSegmentSummary();

    return {
      totalRecords: result?.total_records || 0,
      segmentCount: result?.segment_count || 0,
      companyCount: result?.company_count || 0,
      totalRevenue: result?.total_revenue || 0,
      segments,
      lastFetchedAt: result?.last_fetched_at ? new Date(result.last_fetched_at) : null,
    };
  }

  /**
   * 特定セグメントの損益計算書を取得
   */
  getIncomeStatement(segmentAbbreviation: string): { code: string; nameJa: string; amount: number }[] {
    const query = `
      SELECT
        account_code,
        account_name_ja,
        SUM(segment_amount) as amount
      FROM segment_profit_and_loss
      WHERE segment_abbreviation = @segmentAbbreviation
        AND account_code IN ('1000', '1100', '1200', '1300', '2100', '2200', '2300')
      GROUP BY account_code, account_name_ja
      ORDER BY account_code
    `;

    const stmt = this.db.prepare(query);
    const rows = stmt.all({ segmentAbbreviation }) as any[];

    return rows.map((row) => ({
      code: row.account_code,
      nameJa: row.account_name_ja,
      amount: row.amount,
    }));
  }

  /**
   * 特定セグメントの会社別売上を取得
   */
  getCompanyRevenue(segmentAbbreviation: string): { company: string; revenue: number }[] {
    const query = `
      SELECT
        company_name_ja as company,
        SUM(segment_amount) as revenue
      FROM segment_profit_and_loss
      WHERE segment_abbreviation = @segmentAbbreviation
        AND account_code = '1000'
      GROUP BY company_name_ja
      ORDER BY revenue DESC
    `;

    const stmt = this.db.prepare(query);
    const rows = stmt.all({ segmentAbbreviation }) as any[];

    return rows.map((row) => ({
      company: row.company,
      revenue: row.revenue,
    }));
  }

  /**
   * データベースをクローズ
   */
  close(): void {
    this.db.close();
  }
}
