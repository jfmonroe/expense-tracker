import { useApp } from "../../context/AppContext";
import { formatSignedCurrency } from "../../utils/formatters";
import styles from "./NetIncomeBanner.module.css";

/**
 * NetIncomeBanner shows a large, prominent net income figure.
 *
 * Green if positive (earning more than spending), red if negative.
 * This is the first thing users see on the dashboard so they can
 * quickly assess their financial health.
 */
const NetIncomeBanner = () => {
  const { filteredTransactions } = useApp();

  const income = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const net = income - expenses;
  const isPositive = net >= 0;

  return (
    <div className={`${styles.banner} ${isPositive ? styles.positive : styles.negative}`}>
      <span className={styles.label}>Net Income</span>
      <span className={styles.value}>{formatSignedCurrency(net)}</span>
      <span className={styles.message}>
        {isPositive
          ? "You're winning! Keep stacking that bread. \u{1F35E}"
          : "Spending more than earning. Time to adjust."}
      </span>
    </div>
  );
};

export default NetIncomeBanner;
