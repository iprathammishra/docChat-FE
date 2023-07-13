import { Text } from "@fluentui/react";
import {
  ContentView24Regular,
} from "@fluentui/react-icons";
import styles from "./Summarize.module.css";

export const Summarize = ({ className, onClick, disabled }) => {
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
        <ContentView24Regular />
        <Text>{"Summarize"}</Text>
      </div>
    </div>
  );
};
