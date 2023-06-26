import { Text } from "@fluentui/react";
import { Flowchart24Regular } from "@fluentui/react-icons";
import styles from "./Strawman.module.css";

export const Strawman = ({ className, onClick, disabled }) => {
  return (
    <div>
      <div
        className={`${styles.container} ${className ?? ""} ${
          disabled && styles.disabled
        }`}
        onClick={() => {
          if (!disabled) onClick();
        }}
      >
        <Flowchart24Regular />
        <Text>{"Strawman"}</Text>
      </div>
    </div>
  );
};
