import styles from "./Card.module.css";

/**
 * Reusable Card component — a styled container with a title.
 *
 * Used to visually group related content (e.g. the expense form, the table,
 * each chart). Gives the app a consistent "card" look with rounded corners
 * and a subtle shadow.
 *
 * @param {string} title - Optional heading displayed at the top of the card
 * @param {React.ReactNode} children - Content rendered inside the card
 */
const Card = ({ title, children }) => {
  return (
    <div className={styles.card}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {children}
    </div>
  );
};

export default Card;
