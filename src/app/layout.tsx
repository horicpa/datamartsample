import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'セグメント損益計算書データマート',
  description: '経営管理向けの統合データマート - セグメント別損益分析',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
