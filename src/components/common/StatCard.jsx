import styles from "./StatCard.module.css";

/**
 * StatCard displays a single statistic with a label and value.
 *
 * Used in the summary bar at the top of the app and in various panels
 * to show totals, counts, and averages.
 *
 * @param {string} label - Description text (e.g. "Total Income")
 * @param {string|number} value - The displayed value (e.g. "$3,500.00")
 * @param {string} color - CSS color for the value text (optional)
 */
const StatCard = ({ label, value, color }) => {
  return (
    <div className={styles.card}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value} style={color ? { color } : undefined}>
        {value}
      </span>
    </div>
  );
};

export default StatCard;
