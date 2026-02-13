import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

import Card from "../common/Card";
import { useApp } from "../../context/AppContext";
import {
  getMonthKey,
  formatMonthLabel,
  formatCurrency,
  CHART_TOOLTIP_STYLE,
} from "../../utils/formatters";
import styles from "./NetTrendLineChart.module.css";

/**
 * NetTrendLineChart shows net income (income - expenses) over time as a line.
 *
 * A reference line at $0 makes it easy to see when spending exceeds earning.
 * Green line above zero, red when dipping below.
 */
const NetTrendLineChart = () => {
  const { transactions } = useApp();

  // Use ALL transactions (not filtered) to show the full trend
  const monthlyNet = transactions.reduce((acc, t) => {
    const key = getMonthKey(t.date);
    if (!acc[key]) acc[key] = 0;
    acc[key] += t.type === "income" ? t.amount : -t.amount;
    return acc;
  }, {});

  const data = Object.entries(monthlyNet)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, net]) => ({
      month: formatMonthLabel(key),
      net: Math.round(net * 100) / 100,
    }));

  if (data.length === 0) {
    return (
      <Card title="Net Income Trend">
        <p className={styles.empty}>Add transactions to see the trend.</p>
      </Card>
    );
  }

  return (
    <Card title="Net Income Trend">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
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
          <ReferenceLine y={0} stroke="var(--color-border)" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="net"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={{ fill: "var(--color-primary)", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default NetTrendLineChart;
