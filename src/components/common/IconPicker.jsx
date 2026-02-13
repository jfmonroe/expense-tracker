import styles from "./IconPicker.module.css";

/**
 * IconPicker displays a grid of emoji buttons for selecting an icon.
 *
 * Used in the savings goal form to let users pick a visual icon
 * for their goal (e.g. a house for "Down Payment", a plane for "Vacation").
 *
 * @param {string} selected - Currently selected emoji
 * @param {function} onSelect - Called with the chosen emoji string
 */

const ICONS = [
  "\u{1F3E6}", // bank
  "\u{2708}\u{FE0F}", // airplane
  "\u{1F3E0}", // house
  "\u{1F697}", // car
  "\u{1F393}", // graduation cap
  "\u{1F4BB}", // laptop
  "\u{1F3AF}", // target
  "\u{1F48E}", // gem
  "\u{1F30D}", // earth
  "\u{2764}\u{FE0F}", // heart
  "\u{1F525}", // fire
  "\u{2B50}", // star
  "\u{1F3D6}\u{FE0F}", // beach
  "\u{1F4F1}", // phone
  "\u{1F381}", // gift
  "\u{1F6E1}\u{FE0F}", // shield
];

const IconPicker = ({ selected, onSelect }) => {
  return (
    <div className={styles.grid}>
      {ICONS.map((icon) => (
        <button
          key={icon}
          type="button"
          className={`${styles.icon} ${selected === icon ? styles.selected : ""}`}
          onClick={() => onSelect(icon)}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};

export default IconPicker;
