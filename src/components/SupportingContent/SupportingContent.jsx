import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import styles from "./SupportingContent.module.css";
import remarkGfm from "remark-gfm";

export const SupportingContent = ({ supportingContent }) => {
  return (
    <ul className={styles.supportingContentNavList}>
      {supportingContent.map((x, i) => {
        return (
          <li key={i} className={styles.supportingContentItem}>
            <h4 className={styles.supportingContentItemHeader}>
              {x[0]?.metadata.file || x?.metadata.file}:{" "}
              {x?.metadata?.chunk ?? ""}
            </h4>
            <p className={styles.supportingContentItemText}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className={styles.answerText}
              >
                {x[0]?.pageContent || x?.pageContent}
              </ReactMarkdown>
            </p>
          </li>
        );
      })}
    </ul>
  );
};
