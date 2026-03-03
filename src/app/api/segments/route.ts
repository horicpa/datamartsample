/**
 * セグメント詳細データAPI
 */

import { NextResponse } from 'next/server';
import { SegmentDataMart } from '@/lib/datamart';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const segmentAbbr = searchParams.get('abbr');

  try {
    const dbPath = path.join(process.cwd(), 'segment_datamart.db');
    const datamart = new SegmentDataMart(dbPath);

    if (segmentAbbr) {
      const incomeStatement = datamart.getIncomeStatement(segmentAbbr);
      const companyRevenue = datamart.getCompanyRevenue(segmentAbbr);
      datamart.close();

      return NextResponse.json({
        incomeStatement,
        companyRevenue,
      });
    }

    const allSegments = datamart.getSegmentData();
    datamart.close();

    return NextResponse.json(allSegments);
  } catch (error) {
    console.error('Failed to fetch segment data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
