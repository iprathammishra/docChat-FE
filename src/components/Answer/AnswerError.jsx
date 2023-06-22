import { Stack, PrimaryButton } from "@fluentui/react";
import { ErrorCircle24Regular } from "@fluentui/react-icons";

import styles from "./Answer.module.css";

export const AnswerError = ({ error, onRetry }) => {
  return (
    <Stack className={styles.answerContainer} verticalAlign="space-between">
      <ErrorCircle24Regular
        aria-hidden="true"
        aria-label="Error icon"
        primaryFill="red"
      />

      <Stack.Item grow>
        <p className={styles.answerText}>{error}</p>
      </Stack.Item>

      <PrimaryButton
        className={styles.retryButton}
        onClick={onRetry}
        text="Retry"
      />
    </Stack>
  );
};
