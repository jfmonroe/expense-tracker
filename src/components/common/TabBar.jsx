import { useApp } from "../../context/AppContext";
import styles from "./TabBar.module.css";

/**
 * TabBar renders the main navigation tabs.
 *
 * Each tab is a button that sets the activeTab state in AppContext.
 * The currently active tab gets a highlighted bottom border.
 */

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "\u{1F4C8}" },
  { id: "expenses", label: "Expenses", icon: "\u{1F4B8}" },
  { id: "income", label: "Income", icon: "\u{1F4B0}" },
  { id: "recurring", label: "Recurring", icon: "\u{1F504}" },
  { id: "budget", label: "Budget", icon: "\u{1F4CA}" },
  { id: "savings", label: "Savings", icon: "\u{1F3AF}" },
];

const TabBar = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className={styles.tabBar}>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.active : ""}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className={styles.icon}>{tab.icon}</span>
          <span className={styles.label}>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default TabBar;
