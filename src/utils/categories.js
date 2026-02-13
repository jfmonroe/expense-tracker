/**
 * Expense and income category definitions.
 *
 * Each category has a value (used in data), a label (displayed to users),
 * an emoji icon, and a color for charts. These are used across the app
 * in forms, charts, filters, and budget panels.
 */

// --- Expense Categories ---

export const EXPENSE_CATEGORIES = [
  { value: "Food", label: "Food", icon: "\u{1F355}", color: "#ef4444" },
  { value: "Rent", label: "Rent", icon: "\u{1F3E0}", color: "#f97316" },
  { value: "Transportation", label: "Transportation", icon: "\u{1F697}", color: "#eab308" },
  { value: "Entertainment", label: "Entertainment", icon: "\u{1F3AC}", color: "#3b82f6" },
  { value: "Utilities", label: "Utilities", icon: "\u{26A1}", color: "#a855f7" },
  { value: "Shopping", label: "Shopping", icon: "\u{1F6CD}\u{FE0F}", color: "#ec4899" },
  { value: "Health", label: "Health", icon: "\u{1F48A}", color: "#14b8a6" },
  { value: "Subscriptions", label: "Subscriptions", icon: "\u{1F4F1}", color: "#6366f1" },
  { value: "Other", label: "Other", icon: "\u{1F4E6}", color: "#6b7280" },
];

// --- Income Categories ---

export const INCOME_CATEGORIES = [
  { value: "Salary", label: "Salary", icon: "\u{1F4BC}", color: "#22c55e" },
  { value: "Freelance", label: "Freelance", icon: "\u{1F4BB}", color: "#3b82f6" },
  { value: "Side Hustle", label: "Side Hustle", icon: "\u{1F525}", color: "#f97316" },
  { value: "Investment", label: "Investment", icon: "\u{1F4C8}", color: "#a855f7" },
  { value: "Gift", label: "Gift", icon: "\u{1F381}", color: "#ec4899" },
  { value: "Refund", label: "Refund", icon: "\u{1F4B8}", color: "#14b8a6" },
  { value: "Other", label: "Other", icon: "\u{1F4B0}", color: "#6b7280" },
];

/**
 * Look up a category's color by its value string.
 * Works for both expense and income categories.
 */
export const getCategoryColor = (categoryValue) => {
  const all = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  const found = all.find((c) => c.value === categoryValue);
  return found ? found.color : "#6b7280";
};

/**
 * Look up a category's emoji icon by its value string.
 */
export const getCategoryIcon = (categoryValue) => {
  const all = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  const found = all.find((c) => c.value === categoryValue);
  return found ? found.icon : "\u{1F4E6}";
};
