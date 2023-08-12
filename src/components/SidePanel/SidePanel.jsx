import React, { useState } from "react";
import PromptsList from "../PromptsList/PromptsList";
import OldChats from "../OldChats/OldChats";
import { DefaultButton, Panel } from "@fluentui/react";
import styles from "./SidePanel.module.css";

const SidePanel = ({
  isConfigPanelOpen,
  setIsConfigPanelOpen,
  userId,
  setAnswers,
  setCompany,
  setSummary,
  lastQuestionRef,
}) => {
  const [panelTab, setPanelTab] = useState("history");

  return (
    <Panel
      headerText="Panel"
      isOpen={isConfigPanelOpen}
      isBlocking={false}
      onDismiss={() => setIsConfigPanelOpen(false)}
      closeButtonAriaLabel="Close"
      onRenderFooterContent={() => (
        <DefaultButton onClick={() => setIsConfigPanelOpen(false)}>
          Close
        </DefaultButton>
      )}
      isFooterAtBottom={true}
    >
      <div className={styles.panel_header}>
        <p
          className={panelTab === "history" ? styles.activeTab : null}
          onClick={() => setPanelTab("history")}
        >
          History
        </p>
        <p
          className={panelTab === "prompt" ? styles.activeTab : null}
          onClick={() => setPanelTab("prompt")}
        >
          Prompts
        </p>
      </div>
      {panelTab === "history" ? (
        <OldChats
          userId={userId}
          setAnswers={setAnswers}
          lastQuestionRef={lastQuestionRef}
          setCompany={setCompany}
          setSummary={setSummary}
        />
      ) : (
        <PromptsList />
      )}
    </Panel>
  );
};

export default SidePanel;
