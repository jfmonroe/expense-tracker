import Header from "./components/layout/Header";
import SummaryBar from "./components/layout/SummaryBar";
import FilterBar from "./components/layout/FilterBar";
import TabBar from "./components/common/TabBar";
import { useApp } from "./context/AppContext";
import styles from "./App.module.css";

// Tab panel components
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

const App = () => {
  const { activeTab } = useApp();

  const tabPanels = {
    dashboard: (
      <>
        <DashboardPanel />
      </>
    ),
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
    </div>
  );
};

export default App;
