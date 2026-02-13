import Card from "../common/Card";
import BudgetCategoryRow from "./BudgetCategoryRow";
import { useApp } from "../../context/AppContext";
import { EXPENSE_CATEGORIES } from "../../utils/categories";
import styles from "./BudgetPanel.module.css";

/**
 * BudgetPanel lets users set monthly spending limits per expense category.
 *
 * Each category shows a row with a limit input, a progress bar of how much
 * has been spent, and an over-budget warning if the limit is exceeded.
 * Spending is calculated from filtered transactions (respects month filter).
 */
const BudgetPanel = () => {
  const { filteredTransactions, budgets, setBudgetLimit } = useApp();

  // Calculate how much has been spent per expense category
  const spentByCategory = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((totals, t) => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
      return totals;
    }, {});

  return (
    <Card title="Monthly Budget">
      <p className={styles.description}>
        Set spending limits for each category. Spending reflects the selected
        date range.
      </p>

      <div className={styles.list}>
        {EXPENSE_CATEGORIES.map((cat) => {
          const budget = budgets.find((b) => b.category === cat.value);
          const limit = budget ? budget.limit : 0;
          const spent = spentByCategory[cat.value] || 0;

          return (
            <BudgetCategoryRow
              key={cat.value}
              category={cat}
              limit={limit}
              spent={spent}
              onLimitChange={(newLimit) =>
                setBudgetLimit(cat.value, newLimit)
              }
            />
          );
        })}
      </div>
    </Card>
  );
};

export default BudgetPanel;
