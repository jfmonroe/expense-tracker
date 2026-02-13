import { useState } from "react";

import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";
import { useApp } from "../../context/AppContext";
import {
  formatCurrency,
  formatDate,
  getRecurringLabel,
  RECURRING_OPTIONS,
} from "../../utils/formatters";
import { EXPENSE_CATEGORIES, getCategoryIcon } from "../../utils/categories";
import styles from "./ExpenseList.module.css";

/**
 * ExpenseList shows all expenses in a searchable, sortable table.
 *
 * Uses filteredTransactions from context (already filtered by date range/category),
 * then further filters by a local search query on description or category.
 * Only shows transactions where type === "expense".
 * Supports inline editing — clicking Edit turns a row into input fields.
 */
const ExpenseList = () => {
  const { transactions, filteredTransactions, deleteTransaction, updateTransaction } =
    useApp();
  const [searchQuery, setSearchQuery] = useState("");

  // Inline editing state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editErrors, setEditErrors] = useState({});

  // Filter to expenses only, then apply local search
  const expenses = filteredTransactions.filter((t) => t.type === "expense");

  const searchFiltered = searchQuery.trim()
    ? expenses.filter((t) => {
        const q = searchQuery.toLowerCase();
        return (
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
        );
      })
    : expenses;

  // Sort newest first
  const sorted = [...searchFiltered].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  const hasAnyExpenses = transactions.some((t) => t.type === "expense");

  // --- Inline editing handlers ---

  /** Populates the edit form with the transaction's current values */
  const startEdit = (t) => {
    setEditingId(t.id);
    setEditForm({
      description: t.description,
      amount: t.amount,
      category: t.category,
      date: t.date,
      recurring: t.recurring,
    });
    setEditErrors({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setEditErrors({});
  };

  /** Validates the edit form and returns true if all fields are valid */
  const validateEdit = () => {
    const errors = {};
    if (!editForm.description.trim()) errors.description = "Required";
    if (!editForm.amount || Number(editForm.amount) <= 0)
      errors.amount = "Must be > 0";
    if (!editForm.date) errors.date = "Required";
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveEdit = () => {
    if (!validateEdit()) return;
    updateTransaction(editingId, {
      ...editForm,
      amount: Number(editForm.amount),
    });
    cancelEdit();
  };

  // Options for the category and recurring dropdowns in edit mode
  const categoryOptions = EXPENSE_CATEGORIES.map((c) => ({
    value: c.value,
    label: `${c.icon} ${c.label}`,
  }));

  const recurringOptions = RECURRING_OPTIONS.map((r) => ({
    value: r.value,
    label: r.label,
  }));

  return (
    <Card title="Expenses">
      {hasAnyExpenses && (
        <div className={styles.searchBar}>
          <Input
            label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by description or category..."
          />
        </div>
      )}

      {sorted.length === 0 ? (
        <p className={styles.empty}>
          {!hasAnyExpenses
            ? "No expenses yet. Add one above!"
            : searchQuery.trim()
            ? "No expenses match your search."
            : "No expenses found for the selected filters."}
        </p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Freq</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((t) =>
                t.id === editingId ? (
                  /* Editing row — inputs replace static text */
                  <tr key={t.id} className={styles.editingRow}>
                    <td>
                      <Input
                        label=""
                        type="date"
                        value={editForm.date}
                        onChange={(e) =>
                          setEditForm({ ...editForm, date: e.target.value })
                        }
                        error={editErrors.date}
                      />
                    </td>
                    <td>
                      <Input
                        label=""
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        error={editErrors.description}
                      />
                    </td>
                    <td>
                      <Input
                        label=""
                        type="select"
                        value={editForm.category}
                        onChange={(e) =>
                          setEditForm({ ...editForm, category: e.target.value })
                        }
                        options={categoryOptions}
                      />
                    </td>
                    <td>
                      <Input
                        label=""
                        type="number"
                        value={editForm.amount}
                        onChange={(e) =>
                          setEditForm({ ...editForm, amount: e.target.value })
                        }
                        error={editErrors.amount}
                        step="0.01"
                        min="0"
                      />
                    </td>
                    <td>
                      <Input
                        label=""
                        type="select"
                        value={editForm.recurring}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            recurring: e.target.value,
                          })
                        }
                        options={recurringOptions}
                      />
                    </td>
                    <td>
                      <div className={styles.editActions}>
                        <Button variant="success" onClick={saveEdit}>
                          Save
                        </Button>
                        <Button variant="ghost" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  /* Normal display row */
                  <tr key={t.id}>
                    <td>{formatDate(t.date)}</td>
                    <td>{t.description}</td>
                    <td>
                      <span className={styles.category}>
                        {getCategoryIcon(t.category)} {t.category}
                      </span>
                    </td>
                    <td className={styles.amount}>
                      {formatCurrency(t.amount)}
                    </td>
                    <td className={styles.recurring}>
                      {t.recurring !== "one-time" && (
                        <span className={styles.badge}>
                          {getRecurringLabel(t.recurring)}
                        </span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Button
                          variant="ghost"
                          onClick={() => startEdit(t)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => deleteTransaction(t.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default ExpenseList;
