import NetIncomeBanner from "./NetIncomeBanner";
import CategoryDonutChart from "./CategoryDonutChart";
import IncomeExpenseBarChart from "./IncomeExpenseBarChart";
import NetTrendLineChart from "./NetTrendLineChart";
import CategoryBreakdownGrid from "./CategoryBreakdownGrid";
import styles from "./DashboardPanel.module.css";

/**
 * DashboardPanel assembles all the dashboard visualizations:
 * - Net income banner (big, prominent)
 * - 2x2 chart grid (donut, bar chart, line chart, breakdown)
 *
 * This gives users a comprehensive overview of their finances at a glance.
 */
const DashboardPanel = () => {
  return (
    <div className={styles.dashboard}>
      <NetIncomeBanner />

      <div className={styles.chartGrid}>
        <CategoryDonutChart />
        <IncomeExpenseBarChart />
      </div>

      <NetTrendLineChart />
      <CategoryBreakdownGrid />
    </div>
  );
};

export default DashboardPanel;
