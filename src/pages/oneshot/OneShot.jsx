import { useRef, useState } from "react";
import {
  Checkbox,
  ChoiceGroup,
  IChoiceGroupOption,
  Panel,
  DefaultButton,
  Spinner,
  TextField,
  SpinButton,
} from "@fluentui/react";

import styles from "./OneShot.module.css";

import { askApi, Approaches, AskResponse, AskRequest } from "../../api";
import { Answer, AnswerError } from "../../components/Answer";
import { QuestionInput } from "../../components/QuestionInput";
import { ExampleList } from "../../components/Example";
import {
  AnalysisPanel,
  AnalysisPanelTabs,
} from "../../components/AnalysisPanel";
import { SettingsButton } from "../../components/SettingsButton/SettingsButton";

const OneShot = () => {
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [approach, setApproach] = useState(Approaches.RetrieveThenRead);
  const [promptTemplate, setPromptTemplate] = useState("");
  const [promptTemplatePrefix, setPromptTemplatePrefix] = useState("");
  const [promptTemplateSuffix, setPromptTemplateSuffix] = useState("");
  const [retrieveCount, setRetrieveCount] = useState(3);
  const [useSemanticRanker, setUseSemanticRanker] = useState(true);
  const [useSemanticCaptions, setUseSemanticCaptions] = useState(false);
  const [excludeCategory, setExcludeCategory] = useState("");
  const lastQuestionRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [answer, setAnswer] = useState();

  const [activeCitation, setActiveCitation] = useState();
  const [activeAnalysisPanelTab, setActiveAnalysisPanelTab] =
    useState(undefined);

  const makeApiRequest = async (question) => {
    lastQuestionRef.current = question;

    error && setError(undefined);
    setIsLoading(true);
    setActiveCitation(undefined);
    setActiveAnalysisPanelTab(undefined);

    try {
      const request = {
        question,
        approach,
        overrides: {
          promptTemplate:
            promptTemplate.length === 0 ? undefined : promptTemplate,
          promptTemplatePrefix:
            promptTemplatePrefix.length === 0
              ? undefined
              : promptTemplatePrefix,
          promptTemplateSuffix:
            promptTemplateSuffix.length === 0
              ? undefined
              : promptTemplateSuffix,
          excludeCategory:
            excludeCategory.length === 0 ? undefined : excludeCategory,
          top: retrieveCount,
          semanticRanker: useSemanticRanker,
          semanticCaptions: useSemanticCaptions,
        },
      };
      const result = await askApi(request);
      setAnswer(result);
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const onPromptTemplateChange = (_ev, newValue) => {
    setPromptTemplate(newValue || "");
  };

  const onPromptTemplatePrefixChange = (_ev, newValue) => {
    setPromptTemplatePrefix(newValue || "");
  };

  const onPromptTemplateSuffixChange = (_ev, newValue) => {
    setPromptTemplateSuffix(newValue || "");
  };

  const onRetrieveCountChange = (_ev, newValue) => {
    setRetrieveCount(parseInt(newValue || "3"));
  };

  const onApproachChange = (_ev, option) => {
    setApproach(option?.key || Approaches.RetrieveThenRead);
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

  const onExampleClicked = (example) => {
    makeApiRequest(example);
  };

  const onShowCitation = (citation) => {
    if (
      activeCitation === citation &&
      activeAnalysisPanelTab === AnalysisPanelTabs.CitationTab
    ) {
      setActiveAnalysisPanelTab(undefined);
    } else {
      setActiveCitation(citation);
      setActiveAnalysisPanelTab(AnalysisPanelTabs.CitationTab);
    }
  };

  const onToggleTab = (tab) => {
    if (activeAnalysisPanelTab === tab) {
      setActiveAnalysisPanelTab(undefined);
    } else {
      setActiveAnalysisPanelTab(tab);
    }
  };

  const approaches = [
    {
      key: Approaches.RetrieveThenRead,
      text: "Retrieve-Then-Read",
    },
    {
      key: Approaches.ReadRetrieveRead,
      text: "Read-Retrieve-Read",
    },
    {
      key: Approaches.ReadDecomposeAsk,
      text: "Read-Decompose-Ask",
    },
  ];

  return (
    <div className={styles.oneshotContainer}>
      <div className={styles.oneshotTopSection}>
        <SettingsButton
          className={styles.settingsButton}
          onClick={() => setIsConfigPanelOpen(!isConfigPanelOpen)}
        />
        <h1 className={styles.oneshotTitle}>Ask your data</h1>
        <div className={styles.oneshotQuestionInput}>
          <QuestionInput
            placeholder="Example: Does my plan cover annual eye exams?"
            disabled={isLoading}
            onSend={(question) => makeApiRequest(question)}
          />
        </div>
      </div>
      <div className={styles.oneshotBottomSection}>
        {isLoading && <Spinner label="Generating answer" />}
        {!lastQuestionRef.current && (
          <ExampleList onExampleClicked={onExampleClicked} />
        )}
        {!isLoading && answer && !error && (
          <div className={styles.oneshotAnswerContainer}>
            <Answer
              answer={answer}
              onCitationClicked={(x) => onShowCitation(x)}
              onThoughtProcessClicked={() =>
                onToggleTab(AnalysisPanelTabs.ThoughtProcessTab)
              }
              onSupportingContentClicked={() =>
                onToggleTab(AnalysisPanelTabs.SupportingContentTab)
              }
            />
          </div>
        )}
        {error ? (
          <div className={styles.oneshotAnswerContainer}>
            <AnswerError
              error={error.toString()}
              onRetry={() => makeApiRequest(lastQuestionRef.current)}
            />
          </div>
        ) : null}
        {activeAnalysisPanelTab && answer && (
          <AnalysisPanel
            className={styles.oneshotAnalysisPanel}
            activeCitation={activeCitation}
            onActiveTabChanged={(x) => onToggleTab(x)}
            citationHeight="600px"
            answer={answer}
            activeTab={activeAnalysisPanelTab}
          />
        )}
      </div>

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
        <ChoiceGroup
          className={styles.oneshotSettingsSeparator}
          label="Approach"
          options={approaches}
          defaultSelectedKey={approach}
          onChange={onApproachChange}
        />

        {(approach === Approaches.RetrieveThenRead ||
          approach === Approaches.ReadDecomposeAsk) && (
          <TextField
            className={styles.oneshotSettingsSeparator}
            defaultValue={promptTemplate}
            label="Override prompt template"
            multiline
            autoAdjustHeight
            onChange={onPromptTemplateChange}
          />
        )}

        {approach === Approaches.ReadRetrieveRead && (
          <>
            <TextField
              className={styles.oneshotSettingsSeparator}
              defaultValue={promptTemplatePrefix}
              label="Override prompt prefix template"
              multiline
              autoAdjustHeight
              onChange={onPromptTemplatePrefixChange}
            />
            <TextField
              className={styles.oneshotSettingsSeparator}
              defaultValue={promptTemplateSuffix}
              label="Override prompt suffix template"
              multiline
              autoAdjustHeight
              onChange={onPromptTemplateSuffixChange}
            />
          </>
        )}

        <SpinButton
          className={styles.oneshotSettingsSeparator}
          label="Retrieve this many documents from search:"
          min={1}
          max={50}
          defaultValue={retrieveCount.toString()}
          onChange={onRetrieveCountChange}
        />
        <TextField
          className={styles.oneshotSettingsSeparator}
          label="Exclude category"
          onChange={onExcludeCategoryChanged}
        />
        <Checkbox
          className={styles.oneshotSettingsSeparator}
          checked={useSemanticRanker}
          label="Use semantic ranker for retrieval"
          onChange={onUseSemanticRankerChange}
        />
        <Checkbox
          className={styles.oneshotSettingsSeparator}
          checked={useSemanticCaptions}
          label="Use query-contextual summaries instead of whole documents"
          onChange={onUseSemanticCaptionsChange}
          disabled={!useSemanticRanker}
        />
      </Panel>
    </div>
  );
};

export default OneShot;
