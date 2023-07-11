import { Text } from "@fluentui/react";
import { Add24Regular } from "@fluentui/react-icons";

import styles from "./NewChatButton.module.css";

export const NewChatButton = ({ className, disabled, onClick }) => {
  return (
    <div
      className={`${styles.container} ${className ?? ""} ${
        disabled && styles.disabled
      }`}
      onClick={onClick}
    >
      <Add24Regular />
      <Text>{"New chat"}</Text>
    </div>
  );
};
