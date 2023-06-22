import { Text } from "@fluentui/react";
import { Delete24Regular } from "@fluentui/react-icons";

import styles from "./ClearNamespace.module.css";

export const ClearNamespace = ({ className, onClick }) => {
  return (
    <div className={`${styles.container} ${className}`} onClick={onClick}>
      <Delete24Regular />
      <Text>{"Delete Documents"}</Text>
    </div>
  );
};
