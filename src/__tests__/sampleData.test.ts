import { generateSampleReport, generateMultipleSampleReports } from '@/lib/sampleData';

describe('Sample Data Generation', () => {
  it('should generate a sample report', () => {
    const report = generateSampleReport(1, 0);

    expect(report).toBeDefined();
    expect(report.consolidationAccountingUnit).toBe('決算単位1');
    expect(report.segmentProfitAndLossItems.length).toBeGreaterThan(0);
  });

  it('should have 63 items (3 segments × 7 accounts × 3 companies)', () => {
    const report = generateSampleReport(1);

    expect(report.segmentProfitAndLossItems.length).toBe(63);
  });

  it('should have correct segment count', () => {
    const report = generateSampleReport(1);

    const segments = new Set(
      report.segmentProfitAndLossItems.map((item) => item.segmentAbbreviation)
    );

    expect(segments.size).toBe(3);
  });

  it('should have correct account codes', () => {
    const report = generateSampleReport(1);

    const accountCodes = new Set(
      report.segmentProfitAndLossItems.map((item) => item.accountCode)
    );

    expect(accountCodes.has('1000')).toBe(true); // 売上高
    expect(accountCodes.has('1300')).toBe(true); // 営業利益
    expect(accountCodes.size).toBe(7);
  });

  it('should generate multiple reports', () => {
    const reports = generateMultipleSampleReports(1, 12);

    expect(reports.length).toBe(12);
    reports.forEach((report) => {
      expect(report.segmentProfitAndLossItems.length).toBe(63);
    });
  });

  it('should have negative values for cost and expense items', () => {
    const report = generateSampleReport(1);

    const costItems = report.segmentProfitAndLossItems.filter(
      (item) => item.accountCode === '1100' || item.accountCode === '1200'
    );

    costItems.forEach((item) => {
      expect(item.segmentAmount).toBeLessThan(0);
    });
  });

  it('should have positive values for revenue items', () => {
    const report = generateSampleReport(1);

    const revenueItems = report.segmentProfitAndLossItems.filter(
      (item) => item.accountCode === '1000'
    );

    revenueItems.forEach((item) => {
      expect(item.segmentAmount).toBeGreaterThan(0);
    });
  });
});
