import { Text } from "@fluentui/react";
import { ContentView24Regular } from "@fluentui/react-icons";
import styles from "./Summarize.module.css";

export const Summarize = ({ className, onClick, disabled, company }) => {
  return (
    <div style={{ position: "relative" }}>
      {company && <div className={disabled ? styles.red : styles.green}></div>}
      <div
        className={`${styles.container} ${className ?? ""} ${
          !company ? styles.disabled : disabled ? styles.disabled : null
        }`}
        onClick={() => {
          if (company) onClick();
        }}
      >
        <ContentView24Regular />
        <Text>{"Summarize"}</Text>
      </div>
    </div>
  );
};
