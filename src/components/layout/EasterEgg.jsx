import { useState, useEffect } from "react";
import styles from "./EasterEgg.module.css";
import woodMeme from "/wood-meme.png";

/**
 * EasterEgg - A hidden surprise for your friends 😏
 * 
 * Shows the wood meme when theme is toggled OR when Savings tab is clicked
 */
const EasterEgg = ({ trigger, activeTab }) => {
  const [show, setShow] = useState(false);
  const [hasShownFromToggle, setHasShownFromToggle] = useState(false);
  const [hasShownFromSavings, setHasShownFromSavings] = useState(false);

  // Trigger from theme toggle
  useEffect(() => {
    if (trigger > 0 && !hasShownFromToggle) {
      setShow(true);
      setHasShownFromToggle(true);
    }
  }, [trigger, hasShownFromToggle]);

  // Trigger from Savings tab
  useEffect(() => {
    if (activeTab === "savings" && !hasShownFromSavings) {
      setShow(true);
      setHasShownFromSavings(true);
    }
  }, [activeTab, hasShownFromSavings]);

  if (!show) return null;

  return (
    <div className={styles.overlay} onClick={() => setShow(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={() => setShow(false)}>
          ✕
        </button>
        <img 
          src={woodMeme} 
          alt="Surprise!" 
          className={styles.image}
        />
      </div>
    </div>
  );
};

export default EasterEgg;
