/**
 * Formatting helpers for displaying currency, dates, and recurring labels.
 */

/**
 * Formats a number as US currency (e.g. 52.3 -> "$52.30").
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

/**
 * Formats a number as signed currency: "+$500.00" or "-$52.30".
 * Useful for showing net income where sign matters.
 */
export const formatSignedCurrency = (amount) => {
  const prefix = amount >= 0 ? "+" : "";
  return prefix + formatCurrency(amount);
};

/**
 * Formats an ISO date string ("2026-02-12") into a readable format
 * like "Feb 12, 2026". We parse manually to avoid timezone offset issues.
 */
export const formatDate = (isoString) => {
  const [year, month, day] = isoString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Returns a "YYYY-MM" string from an ISO date, useful for grouping
 * transactions by month.
 */
export const getMonthKey = (isoString) => {
  return isoString.slice(0, 7);
};

/**
 * Converts a "YYYY-MM" key into a readable label like "Feb 2026".
 */
export const formatMonthLabel = (monthKey) => {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
};

/**
 * Returns a sorted array of unique "YYYY-MM" month keys from transactions.
 * Sorted newest-first for dropdowns.
 */
export const getUniqueMonths = (transactions) => {
  const months = [...new Set(transactions.map((t) => getMonthKey(t.date)))];
  return months.sort((a, b) => b.localeCompare(a));
};

/**
 * Returns today's date as "YYYY-MM-DD".
 */
export const getTodayISO = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Recurring frequency options used in forms and labels.
 */
export const RECURRING_OPTIONS = [
  { value: "one-time", label: "One-time" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

/**
 * Returns a human-readable label for a recurring frequency value.
 */
export const getRecurringLabel = (value) => {
  const found = RECURRING_OPTIONS.find((opt) => opt.value === value);
  return found ? found.label : value;
};

/**
 * Returns the last day of the month as an ISO date string.
 * E.g. "2026-02" → "2026-02-28"
 */
export const getLastOfMonthISO = (isoDate) => {
  const [year, month] = isoDate.split("-").map(Number);
  // Day 0 of the next month gives the last day of the current month
  const lastDay = new Date(year, month, 0).getDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
};

/**
 * Preset date ranges for quick filtering.
 * Each preset has an id, a display label, and a getRange() function
 * that returns { from, to } as ISO date strings.
 */
export const DATE_RANGE_PRESETS = [
  {
    id: "this-month",
    label: "This Month",
    getRange: () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      return { from: `${year}-${month}-01`, to: getTodayISO() };
    },
  },
  {
    id: "last-3-months",
    label: "Last 3 Months",
    getRange: () => {
      const now = new Date();
      const threeAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      const year = threeAgo.getFullYear();
      const month = String(threeAgo.getMonth() + 1).padStart(2, "0");
      return { from: `${year}-${month}-01`, to: getTodayISO() };
    },
  },
  {
    id: "this-year",
    label: "This Year",
    getRange: () => {
      const year = new Date().getFullYear();
      return { from: `${year}-01-01`, to: getTodayISO() };
    },
  },
  {
    id: "last-year",
    label: "Last Year",
    getRange: () => {
      const year = new Date().getFullYear() - 1;
      return { from: `${year}-01-01`, to: `${year}-12-31` };
    },
  },
  {
    id: "all-time",
    label: "All Time",
    getRange: () => ({ from: "", to: "" }),
  },
];

/**
 * Consistent tooltip styling for all Recharts charts in the glass theme.
 */
export const CHART_TOOLTIP_STYLE = {
  backgroundColor: "rgba(15, 20, 35, 0.9)",
  borderColor: "rgba(255, 255, 255, 0.1)",
  color: "#e8eaed",
  borderRadius: "8px",
};
