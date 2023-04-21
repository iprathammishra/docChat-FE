import { useEffect, useState } from "react";
import { Stack, IconButton } from "@fluentui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import styles from "./Answer.module.css";

import { AnswerIcon } from "./AnswerIcon";
let marked = require("marked");

export const Answer = ({
  answer,
  isSelected,
  onCitationClicked,
  onSupportingContentClicked,
}) => {
  const [citations, setCitatitons] = useState([]);

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
    console.log(set);
    setCitatitons([...tempArr]);
  }, []);

  return (
    <Stack
      className={`${styles.answerContainer} ${isSelected && styles.selected}`}
      verticalAlign="space-between"
    >
      <Stack.Item>
        <Stack horizontal horizontalAlign="space-between">
          <AnswerIcon />
          <div>
            {/* <IconButton
              style={{ color: "black" }}
              iconProps={{ iconName: "Lightbulb" }}
              title="Show thought process"
              ariaLabel="Show thought process"
              onClick={() => onThoughtProcessClicked()}
              disabled={!answer.thoughts}
            /> */}
            <IconButton
              style={{ color: "black" }}
              iconProps={{ iconName: "ClipboardList" }}
              title="Show supporting content"
              ariaLabel="Show supporting content"
              onClick={() => onSupportingContentClicked()}
              // disabled={!answer.data_points.length}
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
              {
                /* const path = getCitationFilePath(file); */
              }
              const src = `http://localhost:9000/docs/${file}`;
              return (
                <a
                  key={i}
                  target="_blank"
                  className={styles.citation}
                  title={x}
                  // href={src}
                  onClick={() => onCitationClicked(src)}
                >
                  {`${++i}. ${file}`}
                </a>
              );
            })}
          </Stack>
        </Stack.Item>
      )}
    </Stack>
  );
};
