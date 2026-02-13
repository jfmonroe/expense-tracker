/**
 * Helpers for calculating monthly equivalents of recurring transactions.
 *
 * A weekly $100 expense equals ~$433/month (100 * 52/12).
 * These helpers make it easy to show "what this costs per month"
 * regardless of the original frequency.
 */

/** Multipliers to convert any frequency to a monthly equivalent */
const MONTHLY_MULTIPLIERS = {
  "one-time": 0,
  "weekly": 52 / 12,
  "biweekly": 26 / 12,
  "monthly": 1,
  "yearly": 1 / 12,
};

/**
 * Converts an amount at a given frequency to its monthly equivalent.
 * One-time items return 0 since they don't repeat.
 */
export const calculateMonthlyAmount = (amount, recurring) => {
  return amount * (MONTHLY_MULTIPLIERS[recurring] || 0);
};

/**
 * Calculates total monthly recurring expenses and income.
 * Returns { expenses, income, net } all as monthly amounts.
 */
export const calculateMonthlyRecurring = (transactions) => {
  return transactions
    .filter((t) => t.recurring !== "one-time")
    .reduce(
      (totals, t) => {
        const monthly = calculateMonthlyAmount(t.amount, t.recurring);
        if (t.type === "expense") {
          totals.expenses += monthly;
        } else {
          totals.income += monthly;
        }
        totals.net = totals.income - totals.expenses;
        return totals;
      },
      { expenses: 0, income: 0, net: 0 }
    );
};
