// import { Text } from "@fluentui/react";
import { PanelRight24Regular } from "@fluentui/react-icons";

import styles from "./PanelButton.module.css";

export const PanelButton = ({ className, onClick }) => {
  return (
    <div className={`${styles.container} ${className ?? ""}`} onClick={onClick}>
      <PanelRight24Regular />
      {/* <Text>{"Prompts"}</Text> */}
    </div>
  );
};
