import styles from "./Button.module.css";

/**
 * Reusable Button component with multiple visual variants.
 *
 * @param {"primary"|"danger"|"success"|"ghost"} variant - Visual style
 * @param {React.ReactNode} children - Button label
 * @param {object} rest - Any other props passed to <button>
 */
const Button = ({ variant = "primary", children, ...rest }) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
