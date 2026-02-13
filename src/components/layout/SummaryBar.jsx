import StatCard from "../common/StatCard";
import { useApp } from "../../context/AppContext";
import { formatCurrency, formatSignedCurrency } from "../../utils/formatters";
import { calculateMonthlyRecurring } from "../../utils/recurringHelpers";
import styles from "./SummaryBar.module.css";

/**
 * SummaryBar displays 5 stat cards that are always visible at the top.
 *
 * Shows: Total Income, Total Expenses, Net, Monthly Recurring, Total Saved.
 * Uses unfiltered transaction data so the summary always reflects everything.
 */
const SummaryBar = () => {
  const { transactions, savingsGoals } = useApp();

  // Calculate totals from ALL transactions (not filtered)
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const net = totalIncome - totalExpenses;

  // Monthly recurring net (income - expenses from recurring items only)
  const recurring = calculateMonthlyRecurring(transactions);

  // Total saved across all savings goals
  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.saved, 0);

  return (
    <div className={styles.bar}>
      <StatCard
        label="Income"
        value={formatCurrency(totalIncome)}
        color="var(--color-income)"
      />
      <StatCard
        label="Expenses"
        value={formatCurrency(totalExpenses)}
        color="var(--color-expense)"
      />
      <StatCard
        label="Net"
        value={formatSignedCurrency(net)}
        color={net >= 0 ? "var(--color-income)" : "var(--color-expense)"}
      />
      <StatCard
        label="Recurring/mo"
        value={formatSignedCurrency(recurring.net)}
        color={recurring.net >= 0 ? "var(--color-income)" : "var(--color-expense)"}
      />
      <StatCard
        label="Total Saved"
        value={formatCurrency(totalSaved)}
        color="var(--color-primary)"
      />
    </div>
  );
};

export default SummaryBar;
