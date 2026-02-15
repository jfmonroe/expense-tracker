import Header from "./components/layout/Header";
import SummaryBar from "./components/layout/SummaryBar";
import FilterBar from "./components/layout/FilterBar";
import TabBar from "./components/common/TabBar";
import { useApp } from "./context/AppContext";
import styles from "./App.module.css";

/**
 * App is the root layout for BreadWinner.
 *
 * It renders the header, summary bar, filter bar, tab navigation,
 * and the currently active tab panel. Tab panels are lazy-imported
 * to keep this file clean — each tab has its own component.
 */

// Tab panel components (imported statically for simplicity)
import ExpenseForm from "./components/expenses/ExpenseForm";
import ExpenseList from "./components/expenses/ExpenseList";
import IncomeForm from "./components/income/IncomeForm";
import IncomeList from "./components/income/IncomeList";
import RecurringPanel from "./components/recurring/RecurringPanel";
import BudgetPanel from "./components/budget/BudgetPanel";
import SavingsPanel from "./components/savings/SavingsPanel";
import DashboardPanel from "./components/dashboard/DashboardPanel";
import ImportExport from "./components/layout/ImportExport";
import GoogleDriveSync from "./components/layout/GoogleDriveSync";
import EasterEgg from "./components/layout/EasterEgg";

const App = () => {
  const { activeTab, themeToggleCount } = useApp();

  // Map each tab ID to its panel content
  const tabPanels = {
    expenses: (
      <>
        <ExpenseList />
      </>
    ),
    income: (
      <>
        <IncomeList />
      </>
    ),
    recurring: <RecurringPanel />,
    budget: <BudgetPanel />,
    savings: <SavingsPanel />,
    dashboard: <DashboardPanel />,
  };

  return (
    <div className={styles.app}>
      <Header />
      <SummaryBar />

      {/* Tab navigation at the top */}
      <TabBar />

      {/* Cloud Sync at very top of Dashboard */}
      {activeTab === "dashboard" && <GoogleDriveSync />}

      {/* Add forms below tabs */}
      {activeTab === "expenses" && <ExpenseForm />}
      {activeTab === "income" && <IncomeForm />}

      {/* Import/Export below forms */}
      {(activeTab === "expenses" || activeTab === "income") && <ImportExport />}

      {/* Filter controls */}
      <div className={styles.controls}>
        <FilterBar hideCategory={activeTab === "dashboard"} />
      </div>

      <main className={styles.main}>{tabPanels[activeTab]}</main>

      {/* Easter egg - shows when theme is toggled */}
      <EasterEgg trigger={themeToggleCount} />
    </div>
  );
};

export default App;
