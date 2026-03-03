/**
 * サンプルデータ初期化API
 */

import { NextResponse } from 'next/server';
import { SegmentDataMart } from '@/lib/datamart';
import { generateMultipleSampleReports } from '@/lib/sampleData';
import path from 'path';

export async function POST() {
  try {
    const dbPath = path.join(process.cwd(), 'segment_datamart.db');
    const datamart = new SegmentDataMart(dbPath);

    // 12ヶ月分のサンプルデータを生成
    const reports = generateMultipleSampleReports(1, 12);

    let successCount = 0;
    for (const report of reports) {
      if (datamart.storeReport(report)) {
        successCount++;
      }
    }

    datamart.close();

    return NextResponse.json({
      message: 'Sample data initialized successfully',
      reportsStored: successCount,
    });
  } catch (error) {
    console.error('Failed to initialize sample data:', error);
    return NextResponse.json(
      { error: 'Failed to initialize sample data' },
      { status: 500 }
    );
  }
}
