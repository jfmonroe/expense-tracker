import { useState } from "react";

import ProgressBar from "../common/ProgressBar";
import { formatCurrency } from "../../utils/formatters";
import styles from "./BudgetCategoryRow.module.css";

/**
 * BudgetCategoryRow displays one expense category's budget status.
 *
 * Shows the category icon + name, a limit input, spent vs limit text,
 * a progress bar, and an over-budget warning when spending exceeds limit.
 *
 * @param {object} category - Category object { value, label, icon, color }
 * @param {number} limit - Current monthly spending limit
 * @param {number} spent - Amount spent this month in this category
 * @param {function} onLimitChange - Called with new limit when user changes it
 */
const BudgetCategoryRow = ({ category, limit, spent, onLimitChange }) => {
  const [inputValue, setInputValue] = useState(limit > 0 ? String(limit) : "");
  const isOverBudget = limit > 0 && spent > limit;

  const handleBlur = () => {
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed) && parsed >= 0) {
      onLimitChange(parsed);
    } else if (inputValue === "") {
      onLimitChange(0);
    }
  };

  // Choose bar color: red if over budget, category color otherwise
  const barColor = isOverBudget ? "var(--color-danger)" : category.color;

  return (
    <div className={`${styles.row} ${isOverBudget ? styles.overBudget : ""}`}>
      <div className={styles.header}>
        <span className={styles.categoryName}>
          {category.icon} {category.label}
        </span>
        <div className={styles.limitInput}>
          <span className={styles.dollar}>$</span>
          <input
            className={styles.input}
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            placeholder="No limit"
            min="0"
            step="50"
          />
        </div>
      </div>

      <ProgressBar
        value={spent}
        max={limit || spent || 1}
        color={barColor}
      />

      <div className={styles.footer}>
        <span className={styles.spent}>
          {formatCurrency(spent)} spent
        </span>
        {limit > 0 && (
          <span className={isOverBudget ? styles.over : styles.remaining}>
            {isOverBudget
              ? `${formatCurrency(spent - limit)} over!`
              : `${formatCurrency(limit - spent)} remaining`}
          </span>
        )}
      </div>
    </div>
  );
};

export default BudgetCategoryRow;
