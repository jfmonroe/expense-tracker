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

const App = () => {
  const { activeTab } = useApp();

  // Map each tab ID to its panel content
  const tabPanels = {
    expenses: (
      <>
        <ExpenseForm />
        <ExpenseList />
      </>
    ),
    income: (
      <>
        <IncomeForm />
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

      <div className={styles.controls}>
        <FilterBar />
        <ImportExport />
      </div>

      <TabBar />

      <main className={styles.main}>{tabPanels[activeTab]}</main>
    </div>
  );
};

export default App;
