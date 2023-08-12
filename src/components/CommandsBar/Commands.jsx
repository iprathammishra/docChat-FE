import React from "react";
import { Strawman } from "../Strawman/Strawman";
import { Summarize } from "../Summarize/Summarize";
import { ClearNamespace } from "../ClearNamespace";
import UploadButton from "../UploadButton/UploadButton";
import { NewChatButton } from "../NewChatButton";
import { PanelButton } from "../PanelButton";
import styles from "./Commands.module.css";

const Commands = ({
  answers,
  createStrawman,
  summary,
  company,
  createSummary,
  isModalOpen,
  setIsConfigPanelOpen,
  hideModal,
  clearDocs,
  selectedFiles,
  setSelectedFiles,
  setCompany,
  isConfigPanelOpen,
  newChat,
}) => {
  return (
    <div className={styles.commandsContainer}>
      <Strawman
        className={styles.commandButton}
        disabled={answers.chat.length === 0}
        onClick={createStrawman}
      />
      <Summarize
        className={styles.commandButton}
        disabled={!summary}
        company={company}
        onClick={createSummary}
      />
      <ClearNamespace
        className={styles.commandButton}
        isModalOpen={isModalOpen}
        hideModal={hideModal}
        onClick={clearDocs}
      />
      <UploadButton
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        className={styles.commandButton}
        setCompany={setCompany}
        answers={answers}
        company={company}
      />
      <NewChatButton
        className={styles.commandButton}
        onClick={newChat}
        disabled={!company}
      />
      <PanelButton
        className={styles.commandButton}
        onClick={() => setIsConfigPanelOpen(!isConfigPanelOpen)}
      />
    </div>
  );
};

export default Commands;
