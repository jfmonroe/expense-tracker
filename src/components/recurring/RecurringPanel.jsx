import Card from "../common/Card";
import StatCard from "../common/StatCard";
import Button from "../common/Button";
import { useApp } from "../../context/AppContext";
import { formatCurrency, formatDate, getRecurringLabel } from "../../utils/formatters";
import { getCategoryIcon } from "../../utils/categories";
import { calculateMonthlyAmount } from "../../utils/recurringHelpers";
import styles from "./RecurringPanel.module.css";

/**
 * RecurringPanel shows all recurring transactions (both expenses and income)
 * in one unified view with summary cards.
 *
 * Helps users see the full picture of their repeating commitments
 * and how much they add up to per month.
 */
const RecurringPanel = () => {
  const { transactions, deleteTransaction } = useApp();

  // Filter to only recurring items (not one-time)
  const recurring = transactions.filter((t) => t.recurring !== "one-time");

  // Calculate monthly totals
  const monthlyExpenses = recurring
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + calculateMonthlyAmount(t.amount, t.recurring), 0);

  const monthlyIncome = recurring
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + calculateMonthlyAmount(t.amount, t.recurring), 0);

  const monthlyNet = monthlyIncome - monthlyExpenses;

  // Sort by amount descending (biggest recurring items first)
  const sorted = [...recurring].sort((a, b) =>
    calculateMonthlyAmount(b.amount, b.recurring) -
    calculateMonthlyAmount(a.amount, a.recurring)
  );

  return (
    <>
      {/* Summary cards */}
      <div className={styles.summaryRow}>
        <StatCard
          label="Recurring Expenses/mo"
          value={formatCurrency(monthlyExpenses)}
          color="var(--color-expense)"
        />
        <StatCard
          label="Recurring Income/mo"
          value={formatCurrency(monthlyIncome)}
          color="var(--color-income)"
        />
        <StatCard
          label="Recurring Net/mo"
          value={formatCurrency(monthlyNet)}
          color={monthlyNet >= 0 ? "var(--color-income)" : "var(--color-expense)"}
        />
      </div>

      <Card title="All Recurring Items">
        {sorted.length === 0 ? (
          <p className={styles.empty}>
            No recurring transactions yet. Add an expense or income with a
            recurring frequency to see it here.
          </p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Frequency</th>
                  <th>Monthly</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <span
                        className={
                          t.type === "income" ? styles.typeIncome : styles.typeExpense
                        }
                      >
                        {t.type === "income" ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td>{t.description}</td>
                    <td>
                      {getCategoryIcon(t.category)} {t.category}
                    </td>
                    <td
                      className={
                        t.type === "income" ? styles.amountIncome : styles.amountExpense
                      }
                    >
                      {t.type === "income" ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </td>
                    <td>{getRecurringLabel(t.recurring)}</td>
                    <td className={styles.monthly}>
                      {formatCurrency(calculateMonthlyAmount(t.amount, t.recurring))}
                      /mo
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => deleteTransaction(t.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
};

export default RecurringPanel;
