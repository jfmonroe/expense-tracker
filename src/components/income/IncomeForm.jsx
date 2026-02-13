import { useState } from "react";

import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";
import { useApp } from "../../context/AppContext";
import { INCOME_CATEGORIES } from "../../utils/categories";
import { getTodayISO, RECURRING_OPTIONS } from "../../utils/formatters";
import styles from "./IncomeForm.module.css";

/**
 * IncomeForm lets users add income entries (salary, freelance, etc.).
 *
 * Same structure as ExpenseForm but with income categories and a
 * green submit button to visually distinguish it from expenses.
 */
const IncomeForm = () => {
  const { addTransaction } = useApp();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(INCOME_CATEGORIES[0].value);
  const [date, setDate] = useState(getTodayISO());
  const [recurring, setRecurring] = useState("one-time");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!description.trim()) newErrors.description = "Description is required";
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }
    if (!date) newErrors.date = "Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addTransaction({
      type: "income",
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      date,
      recurring,
    });

    setDescription("");
    setAmount("");
    setCategory(INCOME_CATEGORIES[0].value);
    setDate(getTodayISO());
    setRecurring("one-time");
    setErrors({});
  };

  const categoryOptions = INCOME_CATEGORIES.map((c) => ({
    value: c.value,
    label: `${c.icon} ${c.label}`,
  }));

  return (
    <Card title="Add Income">
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Monthly salary"
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
            label="Type"
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

        <Button type="submit" variant="success">
          Add Income
        </Button>
      </form>
    </Card>
  );
};

export default IncomeForm;
