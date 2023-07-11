import { useEffect, useState } from "react";
import { Stack, IconButton } from "@fluentui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BASE_URL } from "../../utils/config";
import styles from "./Answer.module.css";

import { AnswerIcon } from "./AnswerIcon";

export const Answer = ({
  answer,
  isSelected,
  onCitationClicked,
  onSupportingContentClicked,
  onSuggestionClicked,
}) => {
  const [citations, setCitatitons] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  console.log(answer);

  useEffect(() => {
    const tempArr = [];
    const set = new Set();
    answer.citations.filter((citation) => {
      const file = citation[0].metadata.file;
      if (!set.has(file)) {
        tempArr.push(citation);
        set.add(file);
      }
    });
    setCitatitons([...tempArr]);
  }, []);

  useEffect(() => {
    setSuggestions(
      answer.questions.map((ques) => ques.substring(1, ques.length - 1))
    );
  }, [answer]);

  return (
    <Stack
      className={`${styles.answerContainer} ${isSelected && styles.selected}`}
      verticalAlign="space-between"
    >
      <Stack.Item>
        <Stack horizontal horizontalAlign="space-between">
          <AnswerIcon />
          <div>
            <IconButton
              style={{ color: "black" }}
              iconProps={{ iconName: "Copy" }}
              title="Copy the answer"
              ariaLabel="Copy the answer"
              onClick={() => navigator.clipboard.writeText(answer.answer)}
            />
            <IconButton
              style={{ color: "black" }}
              iconProps={{ iconName: "ClipboardList" }}
              title="Show supporting content"
              ariaLabel="Show supporting content"
              onClick={() => onSupportingContentClicked()}
            />
          </div>
        </Stack>
      </Stack.Item>

      <Stack.Item grow>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          className={styles.answerText}
          // dangerouslySetInnerHTML={{
          //   __html: marked(answer.answer),
          // }}
        >
          {answer.answer}
        </ReactMarkdown>
      </Stack.Item>

      {citations.length !== 0 && (
        <Stack.Item>
          <Stack horizontal wrap tokens={{ childrenGap: 5 }}>
            <span className={styles.citationLearnMore}>Citations:</span>
            {citations.map((x, i) => {
              const file = x[0].metadata.file;
              const src = `${BASE_URL}/docs/${file}`;
              return (
                <a
                  key={i}
                  className={styles.citation}
                  title={x}
                  onClick={() => onCitationClicked(src)}
                >
                  {`${++i}. ${file}`}
                </a>
              );
            })}
          </Stack>
        </Stack.Item>
      )}

      {suggestions.length !== 0 && (
        <Stack.Item>
          <Stack
            className={styles.followupQuestionsList}
            horizontal
            wrap
            tokens={{ childrenGap: 5 }}
          >
            <span className={styles.followupQuestionLearnMore}>
              Suggestions:
            </span>
            {suggestions.map((x, i) => {
              return (
                <div
                  key={i}
                  className={styles.followupQuestion}
                  title={x}
                  onClick={() => onSuggestionClicked(x)}
                >
                  {`${++i}. ${x}`}
                </div>
              );
            })}
          </Stack>
        </Stack.Item>
      )}
    </Stack>
  );
};
