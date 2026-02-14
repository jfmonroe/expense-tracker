import { useState } from "react";

import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";
import { useApp } from "../../context/AppContext";
import { EXPENSE_CATEGORIES } from "../../utils/categories";
import { getTodayISO, RECURRING_OPTIONS } from "../../utils/formatters";
import styles from "./ExpenseForm.module.css";

/**
 * ExpenseForm lets users add a new expense.
 *
 * Collects description, amount, category (with emoji labels), date,
 * and recurring frequency. Validates all required fields before saving.
 */
const ExpenseForm = () => {
  const { addTransaction } = useApp();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].value);
  const [date, setDate] = useState(getTodayISO());
  const [recurring, setRecurring] = useState("one-time");
  const [errors, setErrors] = useState({});

  /** Validates all fields, returns true if valid */
  const validate = () => {
    const newErrors = {};
    if (!description.trim()) newErrors.description = "Description is required";
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }
    if (!date) {
      newErrors.date = "Date is required";
    } else {
      // Validate that the date is actually valid (prevents Feb 31, etc.)
      const dateObj = new Date(date + 'T00:00:00');
      if (isNaN(dateObj.getTime())) {
        newErrors.date = "Invalid date";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addTransaction({
      type: "expense",
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      date,
      recurring,
    });

    // Reset form
    setDescription("");
    setAmount("");
    setCategory(EXPENSE_CATEGORIES[0].value);
    setDate(getTodayISO());
    setRecurring("one-time");
    setErrors({});
  };

  // Build category options with emoji labels
  const categoryOptions = EXPENSE_CATEGORIES.map((c) => ({
    value: c.value,
    label: `${c.icon} ${c.label}`,
  }));

  return (
    <Card title="Add Expense">
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Grocery shopping"
            error={errors.description}
          />
          <Input
            label="Amount ($)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            error={errors.amount}
          />
        </div>

        <div className={styles.row}>
          <Input
            label="Category"
            type="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categoryOptions}
          />
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            error={errors.date}
          />
          <Input
            label="Recurring"
            type="select"
            value={recurring}
            onChange={(e) => setRecurring(e.target.value)}
            options={RECURRING_OPTIONS}
          />
        </div>

        <Button type="submit">Add Expense</Button>
      </form>
    </Card>
  );
};

export default ExpenseForm;
