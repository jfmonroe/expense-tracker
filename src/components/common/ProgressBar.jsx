import styles from "./ProgressBar.module.css";

/**
 * ProgressBar shows a horizontal fill bar with a percentage.
 *
 * Used in Budget (spent vs limit) and Savings (saved vs target).
 * The fill color can be customized — defaults to the primary teal accent.
 *
 * @param {number} value - Current value
 * @param {number} max - Maximum/target value
 * @param {string} color - CSS color for the fill bar (optional)
 * @param {boolean} showLabel - Whether to show the percentage label (default true)
 */
const ProgressBar = ({ value, max, color, showLabel = true }) => {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{
            width: `${percentage}%`,
            backgroundColor: color || "var(--color-primary)",
          }}
        />
      </div>
      {showLabel && (
        <span className={styles.label}>{Math.round(percentage)}%</span>
      )}
    </div>
  );
};

export default ProgressBar;
