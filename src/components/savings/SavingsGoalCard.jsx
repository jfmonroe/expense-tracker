import { useState } from "react";

import ProgressBar from "../common/ProgressBar";
import Button from "../common/Button";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../utils/formatters";
import styles from "./SavingsGoalCard.module.css";

/**
 * SavingsGoalCard displays a single savings goal with:
 * - Icon, name, and target amount
 * - Progress bar showing saved vs target
 * - A deposit input to add money to the goal
 * - A delete button to remove the goal
 *
 * @param {object} goal - { id, name, target, saved, icon }
 */
const SavingsGoalCard = ({ goal }) => {
  const { depositToGoal, deleteSavingsGoal } = useApp();
  const [depositAmount, setDepositAmount] = useState("");

  const handleDeposit = () => {
    const parsed = parseFloat(depositAmount);
    if (isNaN(parsed) || parsed <= 0) return;
    depositToGoal(goal.id, parsed);
    setDepositAmount("");
  };

  const percentage = goal.target > 0
    ? Math.min(Math.round((goal.saved / goal.target) * 100), 100)
    : 0;

  const isComplete = goal.saved >= goal.target;

  return (
    <div className={`${styles.card} ${isComplete ? styles.complete : ""}`}>
      <div className={styles.header}>
        <span className={styles.icon}>{goal.icon}</span>
        <div className={styles.info}>
          <span className={styles.name}>{goal.name}</span>
          <span className={styles.target}>
            {formatCurrency(goal.saved)} / {formatCurrency(goal.target)}
          </span>
        </div>
        <Button variant="danger" onClick={() => deleteSavingsGoal(goal.id)}>
          ×
        </Button>
      </div>

      <ProgressBar
        value={goal.saved}
        max={goal.target}
        color={isComplete ? "var(--color-income)" : "var(--color-primary)"}
      />

      {!isComplete && (
        <div className={styles.depositRow}>
          <input
            className={styles.depositInput}
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Amount"
            min="0"
            step="10"
          />
          <Button variant="success" onClick={handleDeposit}>
            Deposit
          </Button>
        </div>
      )}

      {isComplete && (
        <p className={styles.completeMessage}>
          {"\u{1F389}"} Goal reached! Congratulations!
        </p>
      )}
    </div>
  );
};

export default SavingsGoalCard;
