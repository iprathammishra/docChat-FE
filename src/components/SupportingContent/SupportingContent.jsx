import styles from "./SupportingContent.module.css";

export const SupportingContent = ({ supportingContent }) => {
  return (
    <ul className={styles.supportingContentNavList}>
      {supportingContent.map((x, i) => {
        return (
          <li key={i} className={styles.supportingContentItem}>
            <h4 className={styles.supportingContentItemHeader}>
              {x[0].metadata.file}
            </h4>
            <p className={styles.supportingContentItemText}>
              {x[0].pageContent}
            </p>
          </li>
        );
      })}
    </ul>
  );
};
