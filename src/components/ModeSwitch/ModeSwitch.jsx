import { SparkleFilled } from "@fluentui/react-icons";
import styles from "./ModeSwitch.module.css";

const ModeSwitch = () => {
  return (
    <div className={styles.chatEmptyState}>
      <SparkleFilled
        fontSize={"70px"}
        primaryFill={"#1078e7"}
        aria-hidden="true"
        aria-label="Chat logo"
      />
      <h1 className={styles.chatEmptyStateTitle}>Chat with your RFP</h1>
    </div>
  );
};

export default ModeSwitch;
