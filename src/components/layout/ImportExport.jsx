import { useRef } from "react";

import Button from "../common/Button";
import { useApp } from "../../context/AppContext";
import { generateCSV, parseCSV, downloadFile } from "../../utils/csvHelpers";
import styles from "./ImportExport.module.css";

/**
 * ImportExport provides CSV upload and download buttons.
 *
 * Import: reads a CSV/TSV file and adds the parsed transactions to the app.
 * Export: downloads all transactions as a CSV file.
 */
const ImportExport = () => {
  const { transactions, importTransactions } = useApp();
  const fileInputRef = useRef(null);

  /** Handle file selection for import */
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const { transactions: parsed, errors } = parseCSV(text);

      if (errors.length > 0) {
        // Show errors but still import valid rows
        console.warn("CSV import warnings:", errors);
        alert(
          `Imported ${parsed.length} transactions.\n` +
          (errors.length > 0 ? `${errors.length} rows skipped:\n${errors.slice(0, 5).join("\n")}` : "")
        );
      } else if (parsed.length > 0) {
        alert(`Successfully imported ${parsed.length} transactions!`);
      } else {
        alert("No valid transactions found in the file.");
      }

      if (parsed.length > 0) {
        importTransactions(parsed);
      }
    };
    reader.readAsText(file);

    // Reset the input so the same file can be re-imported if needed
    e.target.value = "";
  };

  /** Export all transactions as CSV */
  const handleExport = () => {
    if (transactions.length === 0) {
      alert("No transactions to export.");
      return;
    }
    const csv = generateCSV(transactions);
    downloadFile(csv, "breadwinner-transactions.csv");
  };

  /** Download a CSV template with example rows */
  const handleDownloadTemplate = () => {
    const template = `Type,Description,Amount,Category,Date,Recurring
expense,"Grocery shopping",52.30,Food,2026-02-14,one-time
expense,"Rent payment",1200.00,Rent,2026-02-01,monthly
income,"Salary",3000.00,Salary,2026-02-01,monthly
expense,"Netflix subscription",15.99,Subscriptions,2026-02-01,monthly
income,"Freelance project",250.00,Freelance,2026-02-12,one-time`;
    downloadFile(template, "breadwinner-template.csv");
  };

  return (
    <div className={styles.row}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.tsv,.txt"
        onChange={handleImport}
        className={styles.hiddenInput}
      />
      <Button variant="ghost" onClick={() => fileInputRef.current.click()}>
        {"\u{1F4E5}"} Import CSV
      </Button>
      <Button variant="ghost" onClick={handleExport}>
        {"\u{1F4E4}"} Export CSV
      </Button>
      <Button variant="ghost" onClick={handleDownloadTemplate}>
        {"\u{1F4CB}"} Template
      </Button>
    </div>
  );
};

export default ImportExport;
