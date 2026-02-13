import { useApp } from "../../context/AppContext";
import styles from "./Header.module.css";

/**
 * Header displays the BreadWinner branding with a warm gradient background.
 * Includes a theme toggle button (sun/moon) in the top-right corner.
 */
const Header = () => {
  const { theme, toggleTheme } = useApp();

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <span className={styles.icon}>{"\u{1F35E}"}</span> BreadWinner
      </h1>
      <p className={styles.tagline}>Stack your bread. Watch it grow.</p>
      <button
        className={styles.themeToggle}
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? "\u2600\uFE0F" : "\u{1F319}"}
      </button>
    </header>
  );
};

export default Header;
