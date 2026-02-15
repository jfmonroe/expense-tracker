import { useState, useEffect } from "react";
import styles from "./EasterEgg.module.css";

/**
 * EasterEgg - A hidden surprise for your friends 😏
 * 
 * Shows the wood meme when theme is toggled
 */
const EasterEgg = ({ trigger }) => {
  const [show, setShow] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Only show once per session when trigger changes
    if (trigger > 0 && !hasShown) {
      setShow(true);
      setHasShown(true);
    }
  }, [trigger, hasShown]);

  if (!show) return null;

  return (
    <div className={styles.overlay} onClick={() => setShow(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={() => setShow(false)}>
          ✕
        </button>
        <img 
          src="/wood-meme.png" 
          alt="Surprise!" 
          className={styles.image}
        />
      </div>
    </div>
  );
};

export default EasterEgg;
