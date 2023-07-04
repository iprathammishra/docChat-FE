import { useRef, useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { Panel, DefaultButton } from "@fluentui/react";
import { ArrowUp24Regular, SparkleFilled } from "@fluentui/react-icons";
import styles from "./Chat.module.css";
import { chatApi } from "../../api";
import { Answer, AnswerError, AnswerLoading } from "../../components/Answer";
import { QuestionInput } from "../../components/QuestionInput";
import { UserChatMessage } from "../../components/UserChatMessage";
import {
  AnalysisPanel,
  AnalysisPanelTabs,
} from "../../components/AnalysisPanel";
import { SettingsButton } from "../../components/SettingsButton";
import { ClearChatButton } from "../../components/ClearChatButton";
import UploadButton from "../../components/UploadButton/UploadButton";
import PromptsList from "../oneshot/PromptsList";
import { ClearNamespace } from "../../components/ClearNamespace";
import { useBoolean } from "@fluentui/react-hooks";
import { BASE_URL } from "../../utils/config";
import ContextData from "../../contexts/contextData";
import axios from "axios";
import { Strawman } from "../../components/Strawman/Strawman";

const Chat = ({ navRef, isVisible }) => {
  const [mode, setMode] = useState("QnA");
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [streamData, setStreamData] = useState();
  const [activeCitation, setActiveCitation] = useState();
  const [activeAnalysisPanelTab, setActiveAnalysisPanelTab] =
    useState(undefined);
  const [selectedAnswer, setSelectedAnswer] = useState(0);
  const [answers, setAnswers] = useState({ chat: [] });
  const lastQuestionRef = useRef("");
  const chatMessageStreamEnd = useRef(null);
  const { userId } = useContext(ContextData);
  let chunks = "";

  // const AntSwitch = styled(Switch)(({ theme }) => ({
  //   width: 28,
  //   height: 16,
  //   padding: 0,
  //   display: "flex",
  //   "&:active": {
  //     "& .MuiSwitch-thumb": {
  //       width: 15,
  //     },
  //     "& .MuiSwitch-switchBase.Mui-checked": {
  //       transform: "translateX(9px)",
  //     },
  //   },
  //   "& .MuiSwitch-switchBase": {
  //     padding: 2,
  //     "&.Mui-checked": {
  //       transform: "translateX(12px)",
  //       color: "#fff",
  //       "& + .MuiSwitch-track": {
  //         opacity: 1,
  //         backgroundColor:
  //           theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
  //       },
  //     },
  //   },
  //   "& .MuiSwitch-thumb": {
  //     boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
  //     width: 12,
  //     height: 12,
  //     borderRadius: 6,
  //     transition: theme.transitions.create(["width"], {
  //       duration: 200,
  //     }),
  //   },
  //   "& .MuiSwitch-track": {
  //     borderRadius: 16 / 2,
  //     opacity: 1,
  //     backgroundColor:
  //       theme.palette.mode === "dark"
  //         ? "rgba(255,255,255,.35)"
  //         : "rgba(0,0,0,.25)",
  //     boxSizing: "border-box",
  //   },
  // }));

  // const handleChange = () => {
  //   if (mode === "QnA") {
  //     setMode("Generative");
  //   } else {
  //     setMode("QnA");
  //   }
  // };

  useEffect(
    () => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }),
    [isLoading, streamData]
  );

  const makeApiRequest = async (question, mode) => {
    lastQuestionRef.current = question;

    if (answers.chat.length === 0) {
      answers["id"] = uuidv4();
    }

    error && setError(undefined);
    setIsLoading(true);
    setActiveCitation(undefined);
    setActiveAnalysisPanelTab(undefined);

    try {
      const eventSource = new EventSource(`${BASE_URL}/stream/${userId}`);
      eventSource.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        chunks += data.answer;
        if (chunks !== "") {
          setIsLoading(false);
        }
        setStreamData(chunks);
        let conversation = answers.chat;
        conversation = [...conversation, { user: question, data }];
        setAnswers({ ...answers, chat: conversation });
        if (data.done) {
          eventSource.close();
        }
      });
      const res = await chatApi(question, answers, mode, userId);
      if (res) {
        setStreamData("");
      }
    } catch (e) {
      setError(e);
    }
  };

  const createStrawman = async () => {
    const question = "Draw a strawman structure for the above conversation.";
    lastQuestionRef.current = question;
    setIsLoading(true);

    try {
      const eventSource = new EventSource(
        `${BASE_URL}/strawman/stream/${userId}`
      );
      eventSource.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        chunks += data.answer;
        if (chunks !== "") {
          setIsLoading(false);
        }
        setStreamData(chunks);
        let conversation = answers.chat;
        conversation = [...conversation, { user: question, data }];
        setAnswers({ ...answers, chat: conversation });
        if (data.done) {
          eventSource.close();
        }
      });
      const res = await axios.post(`${BASE_URL}/strawman`, {
        question,
        answers,
        userId,
      });
      if (res) {
        setStreamData("");
      }
    } catch (e) {
      setError(e);
    }
  };

  const clearChat = () => {
    lastQuestionRef.current = "";
    error && setError(undefined);
    setActiveCitation(undefined);
    setActiveAnalysisPanelTab(undefined);
    setAnswers({ chat: [] });
  };

  const clearDocs = async () => {
    showModal();
    const response = await axios.get(`${BASE_URL}/delete?namespace=${userId}`);
    if (response.status <= 299 || response.statusText === "OK") hideModal();
  };

  const onSuggestionClicked = (askedQuestion) => {
    makeApiRequest(askedQuestion, mode);
  };

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
      {isVisible && (
        <div
          onClick={() => navRef.current?.scrollIntoView({ behavior: "smooth" })}
          className={styles.goToTopBtn}
        >
          <ArrowUp24Regular />
        </div>
      )}
      <div className={styles.commandsContainer}>
        <Strawman
          className={styles.commandButton}
          disabled={answers.chat.length === 0}
          onClick={createStrawman}
        />
        <ClearNamespace
          className={styles.commandButton}
          isModalOpen={isModalOpen}
          showModal={showModal}
          hideModal={hideModal}
          onClick={clearDocs}
        />
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
                fontSize={"70px"}
                primaryFill={"#1078e7"}
                aria-hidden="true"
                aria-label="Chat logo"
              />
              <h1 className={styles.chatEmptyStateTitle}>Chat with your RFP</h1>
            </div>
          ) : (
            <div className={styles.chatMessageStream}>
              {answers.chat.map((answer, index) => (
                <div key={index}>
                  <UserChatMessage message={answer.user} />
                  <div className={styles.chatMessageGpt}>
                    <Answer
                      key={index}
                      answer={answer.data}
                      isSelected={
                        selectedAnswer === index &&
                        activeAnalysisPanelTab !== undefined
                      }
                      onCitationClicked={(c) => onShowCitation(c, index)}
                      onSuggestionClicked={onSuggestionClicked}
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
                      // onRetry={() =>
                      //   makeApiRequest(lastQuestionRef.current, mode)
                      // }
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
              disabled={isLoading || streamData}
              onSend={(question) => makeApiRequest(question, mode)}
            />
          </div>
        </div>

        {answers.chat.length > 0 && activeAnalysisPanelTab && (
          <AnalysisPanel
            className={styles.chatAnalysisPanel}
            activeCitation={activeCitation}
            onActiveTabChanged={(x) => onToggleTab(x, selectedAnswer)}
            citationHeight="810px"
            answer={answers.chat[selectedAnswer].data}
            activeTab={activeAnalysisPanelTab}
          />
        )}

        <Panel
          headerText="Prompts"
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
          <PromptsList />
        </Panel>
      </div>
    </div>
  );
};

export default Chat;
