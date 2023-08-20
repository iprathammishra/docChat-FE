import React, { useState } from "react";
import PromptsList from "../PromptsList/PromptsList";
import OldChats from "../OldChats/OldChats";
import { DefaultButton, Dropdown, Panel } from "@fluentui/react";
import styles from "./SidePanel.module.css";

const OPTIONS = [
  { key: "all", text: "All" },
  { key: "rfp", text: "RFP" },
  { key: "research", text: "Research" },
];

const SidePanel = ({
  isConfigPanelOpen,
  setIsConfigPanelOpen,
  setAnswers,
  setCompany,
  setSummary,
  lastQuestionRef,
  setReport,
  setResearchId,
}) => {
  const [panelTab, setPanelTab] = useState("history");
  const [selectedItem, setSelectedItem] = useState({ key: "all", text: "All" });

  const onChange = (event, item) => {
    setSelectedItem(item);
  };

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
        <>
          <Dropdown
            selectedKey={selectedItem ? selectedItem.key : undefined}
            defaultSelectedKey={"all"}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={onChange}
            placeholder="All"
            options={OPTIONS}
          />
          <OldChats
            setAnswers={setAnswers}
            selectedType={selectedItem.key}
            lastQuestionRef={lastQuestionRef}
            setCompany={setCompany}
            setSummary={setSummary}
            setReport={setReport}
            setResearchId={setResearchId}
          />
        </>
      ) : (
        <PromptsList />
      )}
    </Panel>
  );
};

export default SidePanel;
