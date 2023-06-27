import { useRef, useState, useEffect, useContext } from "react";
import { Panel, DefaultButton } from "@fluentui/react";
import { SparkleFilled } from "@fluentui/react-icons";
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
import { styled } from "@mui/material/styles";
import { Switch, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import PromptsList from "../oneshot/PromptsList";
import { ClearNamespace } from "../../components/ClearNamespace";
import { useBoolean } from "@fluentui/react-hooks";
import { BASE_URL } from "../../utils/config";
import ContextData from "../../contexts/contextData";
import axios from "axios";
import { Strawman } from "../../components/Strawman/Strawman";

const Chat = () => {
  const [mode, setMode] = useState("QnA");
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [streamData, setStreamData] = useState();
  const [activeCitation, setActiveCitation] = useState();
  const [activeAnalysisPanelTab, setActiveAnalysisPanelTab] =
    useState(undefined);
  const [selectedAnswer, setSelectedAnswer] = useState(0);
  const [answers, setAnswers] = useState([]);
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
    [streamData]
  );

  const makeApiRequest = async (question, mode) => {
    lastQuestionRef.current = question;

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
        setAnswers([...answers, [question, data]]);
      });
      const res = await chatApi(question, history, mode, userId);
      if (res) {
        setStreamData("");
        eventSource.close();
      }
      setHistory([...history, [question, res.answer]]);
    } catch (e) {
      setError(e);
    }
  };

  const createStrawman = async () => {
    const question = "Draw a strawman structure for the above conversation.";
    lastQuestionRef.current = question;
    let historyString = "";
    history.forEach((element) => {
      historyString += `\n\n\n User: ${element[0]} \n Bot: ${element[1]}`;
    });
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
        setAnswers([...answers, [question, data]]);
      });
      const res = await axios.post(`${BASE_URL}/strawman`, {
        history: historyString,
        userId,
      });
      if (res) {
        setStreamData("");
        eventSource.close();
      }
      setHistory([...history, [question, res.answer]]);
    } catch (e) {
      setError(e);
    }
  };

  const clearChat = () => {
    lastQuestionRef.current = "";
    error && setError(undefined);
    setActiveCitation(undefined);
    setActiveAnalysisPanelTab(undefined);
    setAnswers([]);
    setHistory([]);
  };

  const clearDocs = async () => {
    showModal();
    const response = await axios.get(`${BASE_URL}/delete?namespace=docs-pdf`);
    if (response.status <= 299 || response.statusText === "OK") hideModal();
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
      <div className={styles.commandsContainer}>
        <Strawman
          className={styles.commandButton}
          disabled={answers.length === 0}
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
              <h1 className={styles.chatEmptyStateTitle}>
                Chat with your data
              </h1>
              {/* <Stack
                sx={{ marginTop: "20px", transform: "scale(1.2)" }}
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <Typography>Q&A</Typography>
                <AntSwitch
                  onChange={handleChange}
                  checked={mode === "Generative"}
                  inputProps={{ "aria-label": "ant design" }}
                />
                <Typography>Generative</Typography>
              </Stack> */}
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
