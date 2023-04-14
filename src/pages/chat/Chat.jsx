import { useRef, useState, useEffect } from "react";
import {
  Checkbox,
  Panel,
  DefaultButton,
  TextField,
  SpinButton,
} from "@fluentui/react";
import { SparkleFilled } from "@fluentui/react-icons";

import styles from "./Chat.module.css";

import { chatApi, uploadFilesApi } from "../../api";
import { Answer, AnswerError, AnswerLoading } from "../../components/Answer";
import { QuestionInput } from "../../components/QuestionInput";
import { ExampleList } from "../../components/Example";
import { UserChatMessage } from "../../components/UserChatMessage";
import {
  AnalysisPanel,
  AnalysisPanelTabs,
} from "../../components/AnalysisPanel";
import { SettingsButton } from "../../components/SettingsButton";
import { ClearChatButton } from "../../components/ClearChatButton";
import UploadButton from "../../components/UploadButton/UploadButton";

const Chat = () => {
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [promptTemplate, setPromptTemplate] = useState("");
  const [retrieveCount, setRetrieveCount] = useState(5);
  const [useSemanticRanker, setUseSemanticRanker] = useState(true);
  const [useSemanticCaptions, setUseSemanticCaptions] = useState(false);
  const [excludeCategory, setExcludeCategory] = useState("");
  const [useSuggestFollowupQuestions, setUseSuggestFollowupQuestions] =
    useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const lastQuestionRef = useRef("");
  const chatMessageStreamEnd = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const [activeCitation, setActiveCitation] = useState();
  const [activeAnalysisPanelTab, setActiveAnalysisPanelTab] =
    useState(undefined);

  const [selectedAnswer, setSelectedAnswer] = useState(0);
  const [answers, setAnswers] = useState([]);

  const makeApiRequest = async (question) => {
    lastQuestionRef.current = question;

    error && setError(undefined);
    setIsLoading(true);
    setActiveCitation(undefined);
    setActiveAnalysisPanelTab(undefined);

    try {
      const res = await chatApi(question);
      //   const result = res.answer;
      setAnswers([...answers, [question, res]]);
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    lastQuestionRef.current = "";
    error && setError(undefined);
    setActiveCitation(undefined);
    setActiveAnalysisPanelTab(undefined);
    setAnswers([]);
  };

  useEffect(
    () => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }),
    [isLoading]
  );

  // useEffect(
  //   () => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }),
  //   [selectedFile]
  // );

  // useEffect(() => {
  //   if (selectedFiles.length !== 0) {
  //     const formData = new FormData();
  //     for (let i = 0; i < selectedFiles.length; i++) {
  //       console.log(selectedFiles[i]);
  //       formData.append("files", selectedFiles[i]);
  //     }
  //     uploadFilesApi(formData);
  //   }
  // }, [selectedFiles]);

  // const handleFileInputChange = (event) => {
  //   setSelectedFiles(Array.from(event.target.files));
  // };

  const onPromptTemplateChange = (_ev, newValue) => {
    setPromptTemplate(newValue || "");
  };

  const onRetrieveCountChange = (_ev, newValue) => {
    setRetrieveCount(parseInt(newValue || "3"));
  };

  const onUseSemanticRankerChange = (_ev, checked) => {
    setUseSemanticRanker(!!checked);
  };

  const onUseSemanticCaptionsChange = (_ev, checked) => {
    setUseSemanticCaptions(!!checked);
  };

  const onExcludeCategoryChanged = (_ev, newValue) => {
    setExcludeCategory(newValue || "");
  };

  const onUseSuggestFollowupQuestionsChange = (_ev, checked) => {
    setUseSuggestFollowupQuestions(!!checked);
  };

  const onExampleClicked = (example) => {
    makeApiRequest(example);
  };

  // const handleUpload = () => {
  //   fileInputRef.current.click();
  // };

  const onShowCitation = (citation, index) => {
    if (
      activeCitation === citation &&
      activeAnalysisPanelTab === AnalysisPanelTabs.CitationTab &&
      selectedAnswer === index
    ) {
      setActiveAnalysisPanelTab(undefined);
    } else {
      setActiveCitation(citation);
      setActiveAnalysisPanelTab(AnalysisPanelTabs.CitationTab);
    }

    setSelectedAnswer(index);
  };

  const onToggleTab = (tab, index) => {
    if (activeAnalysisPanelTab === tab && selectedAnswer === index) {
      setActiveAnalysisPanelTab(undefined);
    } else {
      setActiveAnalysisPanelTab(tab);
    }

    setSelectedAnswer(index);
  };

  return (
    <div className={styles.container}>
      <div className={styles.commandsContainer}>
        <ClearChatButton
          className={styles.commandButton}
          onClick={clearChat}
          disabled={!lastQuestionRef.current || isLoading}
        />
        <UploadButton
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          className={styles.commandButton}
        />
        {/* <UploadButton
          handleUpload={handleUpload}
          className={styles.commandButton}
        /> */}
        {/* <input
          type="file"
          multiple
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileInputChange}
        /> */}
        <SettingsButton
          className={styles.commandButton}
          onClick={() => setIsConfigPanelOpen(!isConfigPanelOpen)}
        />
      </div>
      <div className={styles.chatRoot}>
        <div className={styles.chatContainer}>
          {!lastQuestionRef.current ? (
            <div className={styles.chatEmptyState}>
              <SparkleFilled
                fontSize={"120px"}
                primaryFill={"rgba(115, 118, 225, 1)"}
                aria-hidden="true"
                aria-label="Chat logo"
              />
              <h1 className={styles.chatEmptyStateTitle}>
                Chat with your data
              </h1>
              <h2 className={styles.chatEmptyStateSubtitle}>
                Ask anything or try an example
              </h2>
              <ExampleList onExampleClicked={onExampleClicked} />
            </div>
          ) : (
            <div className={styles.chatMessageStream}>
              {answers.map((answer, index) => (
                <div key={index}>
                  <UserChatMessage message={answer[0]} />
                  <div className={styles.chatMessageGpt}>
                    <Answer
                      key={index}
                      answer={answer[1]}
                      isSelected={
                        selectedAnswer === index &&
                        activeAnalysisPanelTab !== undefined
                      }
                      onCitationClicked={(c) => onShowCitation(c, index)}
                      onSupportingContentClicked={() =>
                        onToggleTab(
                          AnalysisPanelTabs.SupportingContentTab,
                          index
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              {isLoading && (
                <>
                  <UserChatMessage message={lastQuestionRef.current} />
                  <div className={styles.chatMessageGptMinWidth}>
                    <AnswerLoading />
                  </div>
                </>
              )}
              {error ? (
                <>
                  <UserChatMessage message={lastQuestionRef.current} />
                  <div className={styles.chatMessageGptMinWidth}>
                    <AnswerError
                      error={error.toString()}
                      onRetry={() => makeApiRequest(lastQuestionRef.current)}
                    />
                  </div>
                </>
              ) : null}
              <div ref={chatMessageStreamEnd} />
            </div>
          )}

          <div className={styles.chatInput}>
            <QuestionInput
              clearOnSend
              placeholder="Ask me anything..."
              disabled={isLoading}
              onSend={(question) => makeApiRequest(question)}
            />
          </div>
        </div>

        {answers.length > 0 && activeAnalysisPanelTab && (
          <AnalysisPanel
            className={styles.chatAnalysisPanel}
            activeCitation={activeCitation}
            onActiveTabChanged={(x) => onToggleTab(x, selectedAnswer)}
            citationHeight="810px"
            answer={answers[selectedAnswer][1]}
            activeTab={activeAnalysisPanelTab}
          />
        )}

        <Panel
          headerText="Configure answer generation"
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
          <TextField
            className={styles.chatSettingsSeparator}
            defaultValue={promptTemplate}
            label="Override prompt template"
            multiline
            autoAdjustHeight
            onChange={onPromptTemplateChange}
          />

          <SpinButton
            className={styles.chatSettingsSeparator}
            label="Retrieve this many documents from search:"
            min={1}
            max={50}
            defaultValue={retrieveCount.toString()}
            onChange={onRetrieveCountChange}
          />
          <TextField
            className={styles.chatSettingsSeparator}
            label="Exclude category"
            onChange={onExcludeCategoryChanged}
          />
          <Checkbox
            className={styles.chatSettingsSeparator}
            checked={useSemanticRanker}
            label="Use semantic ranker for retrieval"
            onChange={onUseSemanticRankerChange}
          />
          <Checkbox
            className={styles.chatSettingsSeparator}
            checked={useSemanticCaptions}
            label="Use query-contextual summaries instead of whole documents"
            onChange={onUseSemanticCaptionsChange}
            disabled={!useSemanticRanker}
          />
          <Checkbox
            className={styles.chatSettingsSeparator}
            checked={useSuggestFollowupQuestions}
            label="Suggest follow-up questions"
            onChange={onUseSuggestFollowupQuestionsChange}
          />
        </Panel>
      </div>
    </div>
  );
};

export default Chat;
