import Input from "../common/Input";
import Button from "../common/Button";
import { useApp } from "../../context/AppContext";
import { DATE_RANGE_PRESETS } from "../../utils/formatters";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "../../utils/categories";
import styles from "./FilterBar.module.css";

/**
 * FilterBar provides date range presets, custom date inputs, and a
 * category dropdown to filter transactions globally.
 *
 * Preset buttons (This Month, Last 3 Months, etc.) allow quick filtering.
 * Custom From/To date inputs give full control and clear the active preset.
 * The category list adapts to the active tab.
 */
const FilterBar = () => {
  const {
    dateRange,
    activePreset,
    applyDatePreset,
    setCustomDateRange,
    selectedCategory,
    setSelectedCategory,
    activeTab,
  } = useApp();

  // Build category options based on active tab
  let categories;
  if (activeTab === "expenses") {
    categories = EXPENSE_CATEGORIES;
  } else if (activeTab === "income") {
    categories = INCOME_CATEGORIES;
  } else {
    categories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  }

  // Remove duplicate "Other" if combining both lists
  const seen = new Set();
  const uniqueCategories = categories.filter((c) => {
    if (seen.has(c.value)) return false;
    seen.add(c.value);
    return true;
  });

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...uniqueCategories.map((c) => ({
      value: c.value,
      label: `${c.icon} ${c.label}`,
    })),
  ];

  return (
    <div className={styles.bar}>
      {/* Preset date range buttons */}
      <div className={styles.presets}>
        {DATE_RANGE_PRESETS.map((preset) => (
          <Button
            key={preset.id}
            variant={activePreset === preset.id ? "primary" : "ghost"}
            onClick={() => applyDatePreset(preset.id)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Custom date range inputs */}
      <div className={styles.customRange}>
        <Input
          label="From"
          type="date"
          value={dateRange.from}
          onChange={(e) => setCustomDateRange(e.target.value, dateRange.to)}
        />
        <Input
          label="To"
          type="date"
          value={dateRange.to}
          onChange={(e) => setCustomDateRange(dateRange.from, e.target.value)}
        />
      </div>

      {/* Category filter */}
      <div className={styles.filter}>
        <Input
          label="Category"
          type="select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={categoryOptions}
        />
      </div>
    </div>
  );
};

export default FilterBar;
