import ProgressBar from "../common/ProgressBar";
import { useApp } from "../../context/AppContext";
import { EXPENSE_CATEGORIES, getCategoryColor } from "../../utils/categories";
import { formatCurrency } from "../../utils/formatters";
import styles from "./CategoryBreakdownGrid.module.css";

/**
 * CategoryBreakdownGrid shows a grid of cards, one per expense category,
 * with the total spent, percentage of total, and a progress bar.
 *
 * Gives users a detailed per-category view of where their money goes.
 */
const CategoryBreakdownGrid = () => {
  const { filteredTransactions } = useApp();

  const expenses = filteredTransactions.filter((t) => t.type === "expense");
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  // Sum by category
  const categoryTotals = expenses.reduce((totals, t) => {
    totals[t.category] = (totals[t.category] || 0) + t.amount;
    return totals;
  }, {});

  // Only show categories that have spending
  const activeCategories = EXPENSE_CATEGORIES.filter(
    (c) => categoryTotals[c.value] > 0
  );

  if (activeCategories.length === 0) return null;

  return (
    <div className={styles.grid}>
      {activeCategories.map((cat) => {
        const spent = categoryTotals[cat.value] || 0;
        const percentage = totalExpenses > 0 ? (spent / totalExpenses) * 100 : 0;

        return (
          <div key={cat.value} className={styles.card}>
            <div className={styles.header}>
              <span className={styles.icon}>{cat.icon}</span>
              <span className={styles.name}>{cat.label}</span>
              <span className={styles.percentage}>
                {Math.round(percentage)}%
              </span>
            </div>
            <ProgressBar
              value={spent}
              max={totalExpenses}
              color={getCategoryColor(cat.value)}
              showLabel={false}
            />
            <span className={styles.amount}>{formatCurrency(spent)}</span>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryBreakdownGrid;
