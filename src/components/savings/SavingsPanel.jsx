import AddGoalForm from "./AddGoalForm";
import SavingsGoalCard from "./SavingsGoalCard";
import { useApp } from "../../context/AppContext";
import styles from "./SavingsPanel.module.css";

/**
 * SavingsPanel shows the "add goal" form and a grid of existing savings goals.
 *
 * Each goal card shows progress, lets users deposit money, and can be deleted.
 */
const SavingsPanel = () => {
  const { savingsGoals } = useApp();

  return (
    <>
      <AddGoalForm />

      {savingsGoals.length > 0 && (
        <div className={styles.grid}>
          {savingsGoals.map((goal) => (
            <SavingsGoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}

      {savingsGoals.length === 0 && (
        <p className={styles.empty}>
          No savings goals yet. Create one above to start tracking your progress!
        </p>
      )}
    </>
  );
};

export default SavingsPanel;
