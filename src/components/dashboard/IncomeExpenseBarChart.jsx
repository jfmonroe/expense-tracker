import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import Card from "../common/Card";
import { useApp } from "../../context/AppContext";
import {
  getMonthKey,
  formatMonthLabel,
  formatCurrency,
  CHART_TOOLTIP_STYLE,
} from "../../utils/formatters";
import styles from "./IncomeExpenseBarChart.module.css";

/**
 * IncomeExpenseBarChart shows income vs expenses side-by-side per month.
 *
 * Two bars per month: green for income, red for expenses.
 * Helps users see the balance between earning and spending over time.
 */
const IncomeExpenseBarChart = () => {
  const { filteredTransactions } = useApp();

  // Group by month, split into income and expense totals
  const monthlyData = filteredTransactions.reduce((acc, t) => {
    const key = getMonthKey(t.date);
    if (!acc[key]) acc[key] = { income: 0, expenses: 0 };
    if (t.type === "income") acc[key].income += t.amount;
    else acc[key].expenses += t.amount;
    return acc;
  }, {});

  const data = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, values]) => ({
      month: formatMonthLabel(key),
      Income: Math.round(values.income * 100) / 100,
      Expenses: Math.round(values.expenses * 100) / 100,
    }));

  if (data.length === 0) {
    return (
      <Card title="Income vs Expenses">
        <p className={styles.empty}>Add transactions to see the chart.</p>
      </Card>
    );
  }

  return (
    <Card title="Income vs Expenses">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "var(--color-text-muted)" }}
          />
          <YAxis tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
          <Tooltip
            formatter={(value) => formatCurrency(value)}
            contentStyle={CHART_TOOLTIP_STYLE}
          />
          <Legend wrapperStyle={{ fontSize: "0.8rem" }} />
          <Bar dataKey="Income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Expenses" fill="var(--color-expense)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default IncomeExpenseBarChart;
