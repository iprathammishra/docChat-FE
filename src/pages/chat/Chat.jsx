import { useRef, useState, useEffect, useContext } from "react";
import { ArrowUp24Regular } from "@fluentui/react-icons";
import { chatApi, feedbackApi } from "../../api";
import { Answer, AnswerError, AnswerLoading } from "../../components/Answer";
import { QuestionInput } from "../../components/QuestionInput";
import { UserChatMessage } from "../../components/UserChatMessage";
import {
  AnalysisPanel,
  AnalysisPanelTabs,
} from "../../components/AnalysisPanel";
import { useBoolean } from "@fluentui/react-hooks";
import { BASE_URL } from "../../utils/config";
import ContextData from "../../contexts/contextData";
import { api } from "../../api/interceptor";
import Popup from "../../components/Popup/Popup";
import Commands from "../../components/CommandsBar/Commands";
import styles from "./Chat.module.css";
import { io } from "socket.io-client";
import SidePanel from "../../components/SidePanel/SidePanel";
import ModeSwitch from "../../components/ModeSwitch/ModeSwitch";

const socket = io(BASE_URL);
let currentTimeOut;

const Chat = ({ navRef, isVisible }) => {
  const [alertMessage, setAlertMessage] = useState("");
  const [summary, setSummary] = useState(null);
  const [showAlert, { toggle: toggleShowAlert }] = useBoolean(false);
  const [company, setCompany] = useState("");
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
  const { userId, mode } = useContext(ContextData);
  let chunks = "";

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("create_room", userId);
    });

    socket.on("summary", (data) => {
      setSummary(data);
      setAlertMessage("Summary is ready!");
      showErrorAlert();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(
    () => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }),
    [isLoading, streamData]
  );

  const showErrorAlert = () => {
    if (currentTimeOut) {
      clearTimeout(currentTimeOut);
    }
    toggleShowAlert();
    currentTimeOut = setTimeout(() => {
      toggleShowAlert();
      setAlertMessage("");
    }, 2500);
  };

  const makeApiRequest = async (question, mode) => {
    if (!company) {
      setAlertMessage(
        "You haven't uploaded any files or you can chat with older files!"
      );
      showErrorAlert();
      return;
    }

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
        let conversation = answers.chat;
        conversation = [...conversation, { user: question, bot: data }];
        setAnswers({ ...answers, chat: conversation });
        if (data.done) {
          eventSource.close();
          setStreamData("");
        }
      });
      const res = await chatApi(question, answers.id, mode, userId);

      if (res) {
        setStreamData("");
      }
    } catch (e) {
      setError(e);
      setIsLoading(false);
    }
  };

  const createStrawman = async () => {
    const question = "Draw a strawman structure for the above conversation.";
    lastQuestionRef.current = question;
    setIsLoading(true);

    let historyString = "";
    answers.chat.forEach((element) => {
      historyString += `\n\n\n User: ${element.user} \n Bot: ${element.bot.answer}`;
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
        let conversation = answers.chat;
        conversation = [...conversation, { user: question, bot: data }];
        setAnswers({ ...answers, chat: conversation });
        if (data.done) {
          eventSource.close();
        }
      });
      const res = await api.post(`${BASE_URL}/strawman`, {
        question,
        historyString,
        userId,
        chatId: answers.id,
      });
      if (res) {
        setStreamData("");
      }
    } catch (e) {
      setError(e);
    }
  };

  const createSummary = async () => {
    if (!summary) {
      setAlertMessage("Generating summary...");
      showErrorAlert();
      return;
    }
    const question =
      "Summarize the whole RFP with proper headings and sub headings.";
    lastQuestionRef.current = question;
    setIsLoading(true);

    const res = await api.post(`${BASE_URL}/summarize`, {
      chatId: answers.id,
    });
    console.log(res.data);
    let conversation = answers.chat;
    conversation = [...conversation, { user: question, bot: res.data }];
    setIsLoading(false);
    setAnswers({ ...answers, chat: conversation });
  };

  const newChat = () => {
    lastQuestionRef.current = "";
    error && setError(undefined);
    setActiveCitation(undefined);
    setActiveAnalysisPanelTab(undefined);
    setCompany("");
    setSummary("");
    setAnswers({ chat: [] });
  };

  const clearDocs = async () => {
    if (!company) {
      setAlertMessage("You haven't uploaded any files!");
      showErrorAlert();
    } else {
      showModal();
      const response = await api.get(
        `${BASE_URL}/delete?namespace=${answers.id}`
      );
      if (response.status <= 299 || response.statusText === "OK") hideModal();
    }
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

  const feedbackHandler = async (index, activity, feedback) => {
    let body;
    if (activity === "like") {
      body = {
        question: answers.chat[index].user,
        answer: answers.chat[index].bot.answer,
        activity,
      };
    } else {
      body = {
        question: answers.chat[index].user,
        answer: answers.chat[index].bot.answer,
        activity,
        reason: feedback,
      };
    }
    try {
      await feedbackApi("answer", body);
      if (activity === "like") {
        setAlertMessage("Thanks for submitting the feedback!");
        showErrorAlert();
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className={styles.container}>
      {!isVisible && (
        <div
          onClick={() => navRef.current?.scrollIntoView({ behavior: "smooth" })}
          className={styles.goToTopBtn}
        >
          <ArrowUp24Regular />
        </div>
      )}
      <Commands
        answers={answers}
        createStrawman={createStrawman}
        summary={summary}
        company={company}
        createSummary={createSummary}
        isModalOpen={isModalOpen}
        setIsConfigPanelOpen={setIsConfigPanelOpen}
        hideModal={hideModal}
        clearDocs={clearDocs}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        setCompany={setCompany}
        isConfigPanelOpen={isConfigPanelOpen}
        newChat={newChat}
      />
      <div className={styles.chatRoot}>
        <div className={styles.chatContainer}>
          {!lastQuestionRef.current ? (
            <ModeSwitch />
          ) : (
            <div className={styles.chatMessageStream}>
              {answers.chat.map((answer, index) => (
                <div key={index}>
                  <UserChatMessage message={answer.user} />
                  <div className={styles.chatMessageGpt}>
                    <Answer
                      key={index}
                      answer={answer.bot}
                      feedbackHandler={(activity, reason) =>
                        feedbackHandler(index, activity, reason)
                      }
                      chatId={answers.id}
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
                      onRetry={() =>
                        makeApiRequest(lastQuestionRef.current, mode)
                      }
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
          {showAlert && <Popup message={alertMessage} />}
        </div>

        {answers.chat.length > 0 && activeAnalysisPanelTab && (
          <AnalysisPanel
            className={styles.chatAnalysisPanel}
            activeCitation={activeCitation}
            onActiveTabChanged={(x) => onToggleTab(x, selectedAnswer)}
            citationHeight="810px"
            answer={answers.chat[selectedAnswer].bot}
            activeTab={activeAnalysisPanelTab}
          />
        )}
        <SidePanel
          isConfigPanelOpen={isConfigPanelOpen}
          setIsConfigPanelOpen={setIsConfigPanelOpen}
          userId={userId}
          setAnswers={setAnswers}
          setCompany={setCompany}
          setSummary={setSummary}
          lastQuestionRef={lastQuestionRef}
        />
      </div>
    </div>
  );
};

export default Chat;
