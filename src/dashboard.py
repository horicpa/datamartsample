"""
Streamlitダッシュボード
セグメント損益計算書データマートの可視化・分析
"""

import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime
import sqlite3

from datamart import SegmentDataMart
from sample_data import generate_multiple_sample_reports


def load_data_from_db(db_path: str) -> pd.DataFrame:
    """
    データベースからデータを読み込む

    Args:
        db_path: データベースパス

    Returns:
        pd.DataFrame: データマートのデータ
    """
    conn = sqlite3.connect(db_path)
    query = """
        SELECT * FROM segment_profit_and_loss
        ORDER BY fetched_at DESC, segment_abbreviation, account_code
    """
    df = pd.read_sql_query(query, conn)
    conn.close()

    if df.empty:
        return None

    df['fetched_at'] = pd.to_datetime(df['fetched_at'])
    return df


def init_sample_data(db_path: str):
    """
    サンプルデータを初期化

    Args:
        db_path: データベースパス
    """
    datamart = SegmentDataMart(db_path=db_path)

    # 12ヶ月分のサンプルデータを生成
    reports = generate_multiple_sample_reports(unit_id=1, num_months=12)

    for report in reports:
        datamart.store_report(report)


def main():
    st.set_page_config(
        page_title="セグメント損益計算書データマート",
        page_icon="📊",
        layout="wide",
        initial_sidebar_state="expanded"
    )

    # CSS カスタマイズ
    st.markdown("""
    <style>
    .main {
        padding-top: 2rem;
    }
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 10px;
    }
    </style>
    """, unsafe_allow_html=True)

    # タイトル
    st.title("📊 セグメント損益計算書データマート")
    st.markdown("経営管理向けの統合データマート - セグメント別損益分析")

    # サイドバー設定
    st.sidebar.header("⚙️ 設定")
    db_path = st.sidebar.text_input("データベースパス", value="segment_datamart.db")

    # サンプルデータ初期化
    if st.sidebar.button("📥 サンプルデータを初期化"):
        with st.spinner("サンプルデータを生成中..."):
            init_sample_data(db_path)
        st.sidebar.success("✓ サンプルデータを初期化しました")

    # データ読み込み
    df = load_data_from_db(db_path)

    if df is None or df.empty:
        st.warning("⚠️ データがありません。サンプルデータを初期化してください。")
        return

    # データプレビューセクション
    st.header("📈 データ概要")
    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric(
            "総レコード数",
            f"{len(df):,}",
            help="蓄積されているデータレコードの総数"
        )

    with col2:
        segments = df['segment_name_ja'].nunique()
        st.metric(
            "セグメント数",
            f"{segments}",
            help="識別されているセグメント数"
        )

    with col3:
        companies = df['company_name_ja'].nunique()
        st.metric(
            "会社数",
            f"{companies}",
            help="グループ内の法人数"
        )

    with col4:
        total_amount = df[df['account_code'] == '1000']['segment_amount'].sum()
        st.metric(
            "売上高合計",
            f"¥{total_amount/100_000_000:.1f}B",
            help="全セグメント・全会社の売上高合計"
        )

    st.divider()

    # セグメント別売上分析
    st.header("💹 セグメント別売上分析")

    col1, col2 = st.columns(2)

    with col1:
        # セグメント別売上高
        revenue_by_segment = df[df['account_code'] == '1000'].groupby('segment_name_ja')['segment_amount'].sum().sort_values(ascending=False)

        fig_revenue = go.Figure(data=[
            go.Bar(
                x=revenue_by_segment.index,
                y=revenue_by_segment.values,
                marker_color=['#667eea', '#764ba2', '#f093fb'],
                text=[f'¥{v/100_000_000:.1f}B' for v in revenue_by_segment.values],
                textposition='outside'
            )
        ])
        fig_revenue.update_layout(
            title="セグメント別売上高",
            xaxis_title="セグメント",
            yaxis_title="売上高 (円)",
            height=400,
            showlegend=False
        )
        st.plotly_chart(fig_revenue, use_container_width=True)

    with col2:
        # セグメント別利益率
        revenue_df = df[df['account_code'] == '1000'].groupby('segment_name_ja')['segment_amount'].sum()
        profit_df = df[df['account_code'] == '1300'].groupby('segment_name_ja')['segment_amount'].sum()
        profit_margin = (profit_df / revenue_df * 100).sort_values(ascending=False)

        fig_margin = go.Figure(data=[
            go.Bar(
                x=profit_margin.index,
                y=profit_margin.values,
                marker_color=['#667eea', '#764ba2', '#f093fb'],
                text=[f'{v:.1f}%' for v in profit_margin.values],
                textposition='outside'
            )
        ])
        fig_margin.update_layout(
            title="セグメント別営業利益率",
            xaxis_title="セグメント",
            yaxis_title="利益率 (%)",
            height=400,
            showlegend=False
        )
        st.plotly_chart(fig_margin, use_container_width=True)

    st.divider()

    # セグメント別詳細分析
    st.header("🔍 セグメント別詳細分析")

    selected_segment = st.selectbox(
        "分析対象セグメントを選択",
        df['segment_name_ja'].unique()
    )

    segment_df = df[df['segment_name_ja'] == selected_segment]

    col1, col2 = st.columns(2)

    with col1:
        # 損益計算書フロー
        account_map = {
            '1000': '売上高',
            '1100': '売上原価',
            '1200': '販売費及び一般管理費',
            '1300': '営業利益',
            '2100': '営業外収益',
            '2200': '営業外費用',
            '2300': '税金等調整前当期利益'
        }

        income_statement = segment_df[segment_df['account_code'].isin(account_map.keys())].groupby('account_code')['segment_amount'].sum()
        income_statement = income_statement.reindex(['1000', '1100', '1200', '1300', '2100', '2200', '2300'])

        fig_income = go.Figure(data=[
            go.Waterfall(
                x=[account_map.get(code, code) for code in income_statement.index],
                y=income_statement.values,
                textposition="outside",
                text=[f'¥{v/100_000_000:.2f}B' for v in income_statement.values],
                connector={"line": {"color": "rgba(63, 63, 63, 0.5)"}},
                decreasing={"marker": {"color": "#EF553B"}},
                increasing={"marker": {"color": "#00CC96"}},
                totals={"marker": {"color": "#636EFA"}}
            )
        ])
        fig_income.update_layout(
            title=f"{selected_segment} - 損益計算書",
            height=450,
            showlegend=False
        )
        st.plotly_chart(fig_income, use_container_width=True)

    with col2:
        # 会社別売上比較
        company_revenue = segment_df[segment_df['account_code'] == '1000'].groupby('company_name_ja')['segment_amount'].sum().sort_values(ascending=False)

        fig_company = go.Figure(data=[
            go.Pie(
                labels=company_revenue.index,
                values=company_revenue.values,
                textposition='inside',
                textinfo='label+percent'
            )
        ])
        fig_company.update_layout(
            title=f"{selected_segment} - 会社別売上比率",
            height=450
        )
        st.plotly_chart(fig_company, use_container_width=True)

    st.divider()

    # 詳細データテーブル
    st.header("📋 詳細データ")

    tab1, tab2 = st.tabs(["セグメント別サマリー", "詳細データ"])

    with tab1:
        # セグメント別サマリー
        summary_data = []

        for segment in df['segment_name_ja'].unique():
            segment_df_temp = df[df['segment_name_ja'] == segment]

            revenue = segment_df_temp[segment_df_temp['account_code'] == '1000']['segment_amount'].sum()
            cogs = segment_df_temp[segment_df_temp['account_code'] == '1100']['segment_amount'].sum()
            sga = segment_df_temp[segment_df_temp['account_code'] == '1200']['segment_amount'].sum()
            operating_income = segment_df_temp[segment_df_temp['account_code'] == '1300']['segment_amount'].sum()

            summary_data.append({
                'セグメント': segment,
                '売上高': revenue,
                '売上原価': cogs,
                '販売費及び一般管理費': sga,
                '営業利益': operating_income,
                '営業利益率': operating_income / revenue * 100 if revenue != 0 else 0
            })

        summary_df = pd.DataFrame(summary_data)

        # 数値フォーマット
        summary_df_display = summary_df.copy()
        for col in ['売上高', '売上原価', '販売費及び一般管理費', '営業利益']:
            summary_df_display[col] = summary_df_display[col].apply(lambda x: f'¥{x/100_000_000:.2f}B')
        summary_df_display['営業利益率'] = summary_df_display['営業利益率'].apply(lambda x: f'{x:.2f}%')

        st.dataframe(summary_df_display, use_container_width=True, hide_index=True)

    with tab2:
        # 詳細データテーブル
        display_columns = ['segment_name_ja', 'account_name_ja', 'company_name_ja', 'segment_amount', 'fetched_at']
        df_display = df[display_columns].copy()
        df_display.columns = ['セグメント', '科目', '会社', '金額', '取得日時']
        df_display['金額'] = df_display['金額'].apply(lambda x: f'¥{x:,.0f}')

        st.dataframe(df_display, use_container_width=True, hide_index=True)

    st.divider()

    # できることの説明
    st.header("✨ このデータマートでできること")

    col1, col2, col3 = st.columns(3)

    with col1:
        st.info("""
        **📊 セグメント別採算分析**
        - セグメント別の売上・利益を可視化
        - セグメント間の成長率・利益率を比較
        - セグメント別の経営指標を分析
        """)

    with col2:
        st.success("""
        **🏢 グループ内会社分析**
        - 各セグメント内での会社別売上比率
        - グループ全体の統合経営管理
        - 連結決算データの詳細分析
        """)

    with col3:
        st.warning("""
        **⏱️ 時系列分析への拡張**
        - 複数月データの蓄積で月次推移分析
        - 売上・利益のトレンド分析
        - セグメント別の変動分析
        """)


if __name__ == "__main__":
    main()
