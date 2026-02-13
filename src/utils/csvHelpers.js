/**
 * CSV import/export helpers.
 *
 * Export: converts transactions array to a CSV string for download.
 * Import: parses a CSV/TSV string into transaction objects.
 */

/**
 * Generates a CSV string from an array of transactions.
 * The output includes a header row and one data row per transaction.
 */
export const generateCSV = (transactions) => {
  const header = "Type,Description,Amount,Category,Date,Recurring";
  const rows = transactions.map((t) => {
    // Wrap description in quotes in case it contains commas
    const desc = `"${t.description.replace(/"/g, '""')}"`;
    return `${t.type},${desc},${t.amount},${t.category},${t.date},${t.recurring}`;
  });
  return [header, ...rows].join("\n");
};

/**
 * Parses a CSV or TSV string into an array of transaction objects.
 * Returns { transactions, errors } where errors lists any problem rows.
 *
 * Expected columns: Type, Description, Amount, Category, Date, Recurring
 * The parser auto-detects tab vs comma separators.
 */
export const parseCSV = (text) => {
  const lines = text.trim().split("\n");
  if (lines.length < 2) {
    return { transactions: [], errors: ["File is empty or has no data rows."] };
  }

  // Detect separator from the header line
  const sep = lines[0].includes("\t") ? "\t" : ",";
  const transactions = [];
  const errors = [];

  // Skip header (line 0), parse data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing that handles quoted fields
    const fields = parseLine(line, sep);

    if (fields.length < 6) {
      errors.push(`Row ${i + 1}: not enough columns (expected 6, got ${fields.length})`);
      continue;
    }

    const [type, description, amountStr, category, date, recurring] = fields;

    // Validate type
    if (type !== "expense" && type !== "income") {
      errors.push(`Row ${i + 1}: type must be "expense" or "income", got "${type}"`);
      continue;
    }

    // Validate amount
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      errors.push(`Row ${i + 1}: invalid amount "${amountStr}"`);
      continue;
    }

    // Validate date format (basic check for YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      errors.push(`Row ${i + 1}: date must be YYYY-MM-DD format, got "${date}"`);
      continue;
    }

    transactions.push({
      id: crypto.randomUUID(),
      type,
      description: description.trim(),
      amount,
      category: category.trim(),
      date,
      recurring: recurring.trim() || "one-time",
    });
  }

  return { transactions, errors };
};

/**
 * Parses a single CSV line, handling quoted fields.
 * Returns an array of field strings.
 */
const parseLine = (line, sep) => {
  const fields = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        // Check for escaped quote ("")
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === sep) {
        fields.push(current);
        current = "";
      } else {
        current += char;
      }
    }
  }
  fields.push(current);
  return fields;
};

/**
 * Triggers a browser file download with the given content.
 */
export const downloadFile = (content, filename) => {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
