import { IconButton, Stack } from "@fluentui/react";
import styles from "./ResearchAnswer.module.css";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import Feedback from "../Feedback/Feedback";
import { AnswerIcon } from "../Answer/AnswerIcon";

const ResearchAnswer = ({ report }) => {
  return (
    <Stack
      className={`${styles.answerContainer}`}
      verticalAlign="space-between"
    >
      <Stack horizontal horizontalAlign="space-between">
        <AnswerIcon />
        <div>
          <IconButton
            style={{ color: "black" }}
            iconProps={{ iconName: "Like" }}
            title="Like the answer"
            ariaLabel="Like the answer"
            // onClick={() => feedbackHandler("like")}
          />
          <IconButton
            style={{ color: "black" }}
            iconProps={{ iconName: "Dislike" }}
            title="Dislike the answer"
            ariaLabel="Dislike the answer"
            // onClick={showFeedbackModal}
          />
          <Feedback
            type={"answer"}
            // feedbackHandler={feedbackHandler}
            // isFeedbackModalOpen={isFeedbackModalOpen}
            // hideFeedbackModal={hideFeedbackModal}
          />
          <IconButton
            style={{ color: "black" }}
            iconProps={{ iconName: "Copy" }}
            title="Copy the answer"
            ariaLabel="Copy the answer"
            onClick={() => navigator.clipboard.writeText(report)}
          />
        </div>
      </Stack>
      <Stack.Item grow>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          className={styles.answerText}
        >
          {report}
        </ReactMarkdown>
      </Stack.Item>
    </Stack>
  );
};

export default ResearchAnswer;
