import { useRef, useState, useEffect } from "react";
// import anime from "animejs/lib/anime.es.js";
// import anime from "animejs";
import {
  Checkbox,
  Panel,
  DefaultButton,
  TextField,
  SpinButton,
} from "@fluentui/react";
import { SparkleFilled } from "@fluentui/react-icons";
import styles from "./Chat.module.css";
import { chatApi } from "../../api";
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
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { styled } from "@mui/material/styles";
import { Switch, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import PromptsList from "../oneshot/PromptsList";

const Chat = () => {
  // const [active, setActive] = useState(true);
  // const [trigger, setTrigger] = useState(true);

  // const checkbox = useRef(null);
  // const checkboxOn = useRef(null);
  // const checkboxOff = useRef(null);

  const [mode, setMode] = useState("QnA");

  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [promptTemplate, setPromptTemplate] = useState("");
  const [retrieveCount, setRetrieveCount] = useState(5);
  const [useSemanticRanker, setUseSemanticRanker] = useState(true);
  const [useSemanticCaptions, setUseSemanticCaptions] = useState(false);
  const [excludeCategory, setExcludeCategory] = useState("");
  const [useSuggestFollowupQuestions, setUseSuggestFollowupQuestions] =
    useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [history, setHistory] = useState([]);

  const lastQuestionRef = useRef("");
  const chatMessageStreamEnd = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const [activeCitation, setActiveCitation] = useState();
  const [activeAnalysisPanelTab, setActiveAnalysisPanelTab] =
    useState(undefined);

  const [selectedAnswer, setSelectedAnswer] = useState(0);
  const [answers, setAnswers] = useState([]);

  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
    "&:active": {
      "& .MuiSwitch-thumb": {
        width: 15,
      },
      "& .MuiSwitch-switchBase.Mui-checked": {
        transform: "translateX(9px)",
      },
    },
    "& .MuiSwitch-switchBase": {
      padding: 2,
      "&.Mui-checked": {
        transform: "translateX(12px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(["width"], {
        duration: 200,
      }),
    },
    "& .MuiSwitch-track": {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,.35)"
          : "rgba(0,0,0,.25)",
      boxSizing: "border-box",
    },
  }));

  const handleChange = () => {
    if (mode === "QnA") {
      setMode("Generative");
    } else {
      setMode("QnA");
    }
  };

  useEffect(() => {
    console.log(mode);
  }, [mode]);

  // useEffect(() => {
  //   anime({
  //     targets: checkboxOn.current,
  //     translateX: "0",
  //     zIndex: {
  //       value: [1, 2],
  //       round: true,
  //     },
  //     duration: 0,
  //   });

  //   anime({
  //     targets: checkboxOff.current,
  //     translateX: "-100%",
  //     zIndex: {
  //       value: [2, 1],
  //       round: true,
  //     },
  //     duration: 0,
  //   });
  // }, []);

  // useEffect(() => {
  //   if (!active) {
  //     checkbox.current.removeAttribute("checked");
  //     animate(checkboxOff.current, checkboxOn.current, "0%", "100%");
  //   } else {
  //     checkbox.current.setAttribute("checked", true);
  //     animate(checkboxOn.current, checkboxOff.current, "0%", "-100%");
  //   }
  // }, [active]);

  // const handleClick = () => {
  //   console.log(active);
  //   if (trigger) {
  //     setActive(!active);
  //     setTrigger(false);
  //   }
  // };

  // const animate = (
  //   firstTarget,
  //   secondTarget,
  //   firstTranslate,
  //   secondTranslate
  // ) => {
  //   anime({
  //     targets: firstTarget,
  //     translateX: ["0%", "100%"], // from 100 to 250

  //     direction: "normal",
  //   });
  //   setTrigger(true);

  //   // anime({
  //   //   targets: firstTarget,
  //   //   zIndex: {
  //   //     value: [1, 2],
  //   //     round: true,
  //   //   },
  //   //   duration: 0,
  //   // });

  //   // anime({
  //   //   targets: secondTarget,
  //   //   zIndex: {
  //   //     value: [2, 1],
  //   //     round: true,
  //   //   },
  //   //   duration: 0,
  //   // });

  //   // anime({
  //   //   targets: firstTarget,
  //   //   translateX: firstTranslate,
  //   //   duration: 500,
  //   //   easing: "easeInOutQuad",
  //   //   complete: () => {
  //   //     anime({
  //   //       targets: secondTarget,
  //   //       translateX: secondTranslate,
  //   //       duration: 0,
  //   //     });
  //   //     setTrigger(true);
  //   //   },
  //   // });
  // };

  const makeApiRequest = async (question, mode) => {
    lastQuestionRef.current = question;

    error && setError(undefined);
    setIsLoading(true);
    setActiveCitation(undefined);
    setActiveAnalysisPanelTab(undefined);

    try {
      const res = await chatApi(question, history, mode);
      setAnswers([...answers, [question, res]]);
      setHistory([...history, [question, res.answer]]);
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
    makeApiRequest(example, mode);
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
                fontSize={"120px"}
                primaryFill={"#1078e7"}
                aria-hidden="true"
                aria-label="Chat logo"
              />
              <h1 className={styles.chatEmptyStateTitle}>
                Chat with your data
              </h1>
              <Stack
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
                  // value={mode}
                />
                <Typography>Generative</Typography>
              </Stack>
              {/* <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
              >
                <ToggleButton value="qna">Q&A</ToggleButton>
                <ToggleButton value="generative">Generative</ToggleButton>
              </ToggleButtonGroup> */}
              {/* <div className={`${styles.checkbox} ${active && "active"}`}>
                <input
                  type="checkbox"
                  id="checkbox"
                  checked
                  name="checkbox"
                  onClick={handleClick}
                  ref={checkbox}
                />
                <label for="checkbox"></label>
                <div className={styles.on} ref={checkboxOn}>
                  <span>Q&A</span>
                </div>
                <div className={styles.off} ref={checkboxOn}>
                  <span>Generative</span>
                </div>
              </div> */}
              {/* <ExampleList onExampleClicked={onExampleClicked} /> */}
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
              disabled={isLoading}
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
