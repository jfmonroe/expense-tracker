import { createContext, useContext, useState, useEffect, useMemo } from "react";

import { DATE_RANGE_PRESETS, getTodayISO } from "../utils/formatters";

/**
 * AppContext is the central state store for BreadWinner.
 *
 * It manages:
 * - Transactions (both expenses and income)
 * - Budget limits per expense category
 * - Savings goals with deposit tracking
 * - Filter state (date range and category)
 * - Active tab for navigation
 * - Theme (dark/light)
 *
 * All data is persisted to localStorage under "breadwinner-data".
 * On first load, if old expense-tracker data exists, it's migrated.
 */

const AppContext = createContext();

const STORAGE_KEY = "breadwinner-data";
const OLD_STORAGE_KEY = "expense-tracker-data";
const THEME_KEY = "breadwinner-theme";

/**
 * Loads data from localStorage, with migration from the old format.
 * Returns { transactions, budgets, savingsGoals }.
 */
const loadData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        transactions: parsed.transactions || [],
        budgets: parsed.budgets || [],
        savingsGoals: parsed.savingsGoals || [],
      };
    }

    // Migrate from old expense-tracker format if it exists
    const oldData = localStorage.getItem(OLD_STORAGE_KEY);
    if (oldData) {
      const oldExpenses = JSON.parse(oldData);
      const migrated = oldExpenses.map((exp) => ({
        ...exp,
        type: "expense",
        recurring: "one-time",
      }));
      // Clear old key after migration
      localStorage.removeItem(OLD_STORAGE_KEY);
      return { transactions: migrated, budgets: [], savingsGoals: [] };
    }

    return { transactions: [], budgets: [], savingsGoals: [] };
  } catch {
    return { transactions: [], budgets: [], savingsGoals: [] };
  }
};

export const AppProvider = ({ children }) => {
  const initialData = loadData();

  const [transactions, setTransactions] = useState(initialData.transactions);
  const [budgets, setBudgets] = useState(initialData.budgets);
  const [savingsGoals, setSavingsGoals] = useState(initialData.savingsGoals);

  // Filter state — date range replaces the old month dropdown
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [activePreset, setActivePreset] = useState("all-time");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Theme — default from localStorage, fallback to "dark"
  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_KEY) || "dark"
  );

  // Tab navigation
  const [activeTab, setActiveTab] = useState("expenses");

  // Apply theme to the document root and persist to localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  /** Toggles between dark and light themes */
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Persist all data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ transactions, budgets, savingsGoals })
      );
    } catch {
      console.warn("BreadWinner: Could not save to localStorage.");
    }
  }, [transactions, budgets, savingsGoals]);

  // Auto-generate recurring transaction entries
  useEffect(() => {
    const generateRecurringEntries = () => {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;
      
      // Find all recurring transactions
      const recurringTransactions = transactions.filter(
        (t) => t.recurring !== "one-time"
      );

      const newEntries = [];

      recurringTransactions.forEach((template) => {
        const templateDate = new Date(template.date + 'T00:00:00');
        const templateYear = templateDate.getFullYear();
        const templateMonth = templateDate.getMonth() + 1;
        
        // Calculate how many periods have passed since the original date
        let periodsToGenerate = [];
        
        if (template.recurring === "monthly") {
          // Generate entries for each month from template date to current month
          for (let year = templateYear; year <= currentYear; year++) {
            const startMonth = year === templateYear ? templateMonth : 1;
            const endMonth = year === currentYear ? currentMonth : 12;
            
            for (let month = startMonth; month <= endMonth; month++) {
              const entryDate = `${year}-${String(month).padStart(2, "0")}-${String(templateDate.getDate()).padStart(2, "0")}`;
              
              // Check if we already have an entry for this period
              const exists = transactions.some(
                (t) =>
                  t.description === template.description &&
                  t.category === template.category &&
                  t.amount === template.amount &&
                  t.date === entryDate
              );
              
              if (!exists && entryDate <= getTodayISO()) {
                periodsToGenerate.push(entryDate);
              }
            }
          }
        } else if (template.recurring === "yearly") {
          // Generate entries for each year
          for (let year = templateYear; year <= currentYear; year++) {
            const entryDate = `${year}-${String(templateMonth).padStart(2, "0")}-${String(templateDate.getDate()).padStart(2, "0")}`;
            
            const exists = transactions.some(
              (t) =>
                t.description === template.description &&
                t.category === template.category &&
                t.amount === template.amount &&
                t.date === entryDate
            );
            
            if (!exists && entryDate <= getTodayISO()) {
              periodsToGenerate.push(entryDate);
            }
          }
        } else if (template.recurring === "weekly" || template.recurring === "biweekly") {
          // For weekly/biweekly, generate based on intervals from template date
          const interval = template.recurring === "weekly" ? 7 : 14;
          let currentDate = new Date(templateDate);
          
          while (currentDate <= today) {
            const entryDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
            
            const exists = transactions.some(
              (t) =>
                t.description === template.description &&
                t.category === template.category &&
                t.amount === template.amount &&
                t.date === entryDate
            );
            
            if (!exists) {
              periodsToGenerate.push(entryDate);
            }
            
            currentDate.setDate(currentDate.getDate() + interval);
          }
        }
        
        // Create new entries for each generated period
        periodsToGenerate.forEach((date) => {
          newEntries.push({
            ...template,
            id: crypto.randomUUID(),
            date,
          });
        });
      });

      // Add all new entries at once
      if (newEntries.length > 0) {
        setTransactions((prev) => [...prev, ...newEntries]);
      }
    };

    // Run on mount and whenever transactions change
    generateRecurringEntries();
  }, []); // Only run once on mount to avoid infinite loop

  // --- Filtered transactions (by date range and category) ---
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    if (dateRange.from) {
      filtered = filtered.filter((t) => t.date >= dateRange.from);
    }
    if (dateRange.to) {
      filtered = filtered.filter((t) => t.date <= dateRange.to);
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }
    return filtered;
  }, [transactions, dateRange, selectedCategory]);

  // --- Transaction actions ---

  const addTransaction = (transaction) => {
    setTransactions((prev) => [
      ...prev,
      { ...transaction, id: crypto.randomUUID() },
    ]);
  };

  /** Updates specific fields on an existing transaction */
  const updateTransaction = (id, updates) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Date range actions ---

  /** Applies a preset date range by its id */
  const applyDatePreset = (presetId) => {
    const preset = DATE_RANGE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setDateRange(preset.getRange());
      setActivePreset(presetId);
    }
  };

  /** Sets a custom from/to date range and clears the active preset */
  const setCustomDateRange = (from, to) => {
    setDateRange({ from, to });
    setActivePreset("");
  };

  // --- Budget actions ---

  /** Sets the monthly spending limit for a given expense category */
  const setBudgetLimit = (category, limit) => {
    setBudgets((prev) => {
      const existing = prev.find((b) => b.category === category);
      if (existing) {
        return prev.map((b) =>
          b.category === category ? { ...b, limit } : b
        );
      }
      return [...prev, { category, limit }];
    });
  };

  // --- Savings actions ---

  const addSavingsGoal = (goal) => {
    setSavingsGoals((prev) => [
      ...prev,
      { ...goal, id: crypto.randomUUID(), saved: 0 },
    ]);
  };

  const deleteSavingsGoal = (id) => {
    setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
  };

  /** Adds money to a specific savings goal */
  const depositToGoal = (goalId, amount) => {
    setSavingsGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, saved: g.saved + amount } : g
      )
    );
  };

  // --- Import: merge new transactions into existing data ---
  const importTransactions = (newTransactions) => {
    setTransactions((prev) => [...prev, ...newTransactions]);
  };

  return (
    <AppContext.Provider
      value={{
        // Data
        transactions,
        filteredTransactions,
        budgets,
        savingsGoals,

        // Transaction actions
        addTransaction,
        updateTransaction,
        deleteTransaction,
        importTransactions,

        // Budget actions
        setBudgetLimit,

        // Savings actions
        addSavingsGoal,
        deleteSavingsGoal,
        depositToGoal,

        // Filters
        dateRange,
        activePreset,
        applyDatePreset,
        setCustomDateRange,
        selectedCategory,
        setSelectedCategory,

        // Theme
        theme,
        toggleTheme,

        // Navigation
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

/**
 * Custom hook for consuming the app context.
 * Every component that needs data calls useApp().
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
