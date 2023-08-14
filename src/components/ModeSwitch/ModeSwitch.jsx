import { useContext } from "react";
import ContextData from "../../contexts/contextData";
import { Icon } from "@fluentui/react/lib/Icon";
import styles from "./ModeSwitch.module.css";

const ModeSwitch = () => {
  const { mode, setMode } = useContext(ContextData);

  return (
    <div className={styles.chatEmptyState}>
      <div className={styles.container}>
        <div
          className={`${styles.rfp} ${mode === "QnA" && styles.activeMode}`}
          onClick={() => setMode("QnA")}
        >
          <Icon className={styles.icon} iconName="ComplianceAudit" />
          <p>RFP Tool</p>
        </div>
        <div
          className={`${styles.research} ${
            mode === "research" && styles.activeMode
          }`}
          onClick={() => setMode("research")}
        >
          <Icon className={styles.icon} iconName="Financial" />
          <p>Research Tool</p>
        </div>
      </div>
    </div>
  );
};

export default ModeSwitch;
