import { useState } from "react";

import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";
import IconPicker from "../common/IconPicker";
import { useApp } from "../../context/AppContext";
import styles from "./AddGoalForm.module.css";

/**
 * AddGoalForm lets users create a new savings goal.
 *
 * They enter a goal name, target amount, and pick an emoji icon.
 * The goal starts with $0 saved and tracks progress over time.
 */
const AddGoalForm = () => {
  const { addSavingsGoal } = useApp();

  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [icon, setIcon] = useState("\u{1F3AF}");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Goal name is required";
    const parsed = parseFloat(target);
    if (!target || isNaN(parsed) || parsed <= 0) {
      newErrors.target = "Target must be a positive number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addSavingsGoal({
      name: name.trim(),
      target: parseFloat(target),
      icon,
    });

    setName("");
    setTarget("");
    setIcon("\u{1F3AF}");
    setErrors({});
  };

  return (
    <Card title="New Savings Goal">
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <Input
            label="Goal Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Emergency Fund"
            error={errors.name}
          />
          <Input
            label="Target Amount ($)"
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="10000"
            step="100"
            min="0"
            error={errors.target}
          />
        </div>

        <div className={styles.iconSection}>
          <span className={styles.iconLabel}>Pick an Icon</span>
          <IconPicker selected={icon} onSelect={setIcon} />
        </div>

        <Button type="submit">Create Goal</Button>
      </form>
    </Card>
  );
};

export default AddGoalForm;
