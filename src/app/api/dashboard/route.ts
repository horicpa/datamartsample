/**
 * ダッシュボード用API
 */

import { NextResponse } from 'next/server';
import { SegmentDataMart } from '@/lib/datamart';
import path from 'path';

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'segment_datamart.db');
    const datamart = new SegmentDataMart(dbPath);

    const data = datamart.getDashboardData();
    datamart.close();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
