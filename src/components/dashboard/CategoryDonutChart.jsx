import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import Card from "../common/Card";
import { useApp } from "../../context/AppContext";
import { getCategoryColor } from "../../utils/categories";
import { formatCurrency, CHART_TOOLTIP_STYLE } from "../../utils/formatters";
import styles from "./CategoryDonutChart.module.css";

/**
 * CategoryDonutChart shows expense spending broken down by category
 * as a donut (pie chart with a hollow center).
 *
 * Uses filteredTransactions so it respects the month/category filters.
 */
const CategoryDonutChart = () => {
  const { filteredTransactions } = useApp();

  // Sum expenses by category
  const expenses = filteredTransactions.filter((t) => t.type === "expense");
  const categoryTotals = expenses.reduce((totals, t) => {
    totals[t.category] = (totals[t.category] || 0) + t.amount;
    return totals;
  }, {});

  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100,
  }));

  if (data.length === 0) {
    return (
      <Card title="Spending by Category">
        <p className={styles.empty}>Add expenses to see the chart.</p>
      </Card>
    );
  }

  return (
    <Card title="Spending by Category">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={55}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={{ stroke: "var(--color-text-muted)" }}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={getCategoryColor(entry.name)}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(value)}
            contentStyle={CHART_TOOLTIP_STYLE}
          />
          <Legend
            wrapperStyle={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default CategoryDonutChart;
