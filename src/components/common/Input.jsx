import styles from "./Input.module.css";

/**
 * Reusable Input component with a label.
 *
 * Wraps a standard <input> (or <select> when type="select") with a label
 * and optional error message. This keeps form markup consistent and avoids
 * repeating the same label + input + error pattern in every form field.
 *
 * @param {string} label - The text label shown above the input
 * @param {string} error - Validation error message (shown in red if present)
 * @param {string} type - Input type; use "select" for a dropdown
 * @param {Array} options - Options for the select dropdown (when type="select")
 * @param {object} rest - Any other props passed through to the <input> or <select>
 */
const Input = ({ label, error, type = "text", options = [], ...rest }) => {
  // For date inputs, ensure we force the native date picker
  const inputType = type === "date" ? "date" : type;

  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>

      {type === "select" ? (
        <select className={`${styles.input} ${error ? styles.inputError : ""}`} {...rest}>
          {options.map((option) => {
            // Support both plain strings ("Food") and objects ({ value, label })
            const value = typeof option === "string" ? option : option.value;
            const label = typeof option === "string" ? option : option.label;
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </select>
      ) : (
        <input
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          type={inputType}
          {...rest}
        />
      )}

      {/* Only show error text when there's a validation problem */}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default Input;
