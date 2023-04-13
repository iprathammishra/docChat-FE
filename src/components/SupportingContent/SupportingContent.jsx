// import { parseSupportingContentItem } from "./SupportingContentParser";

import styles from "./SupportingContent.module.css";

export const SupportingContent = ({ supportingContent }) => {
  console.log(supportingContent);
  return (
    <ul className={styles.supportingContentNavList}>
      {supportingContent.map((x, i) => {
        return (
          <li key={i} className={styles.supportingContentItem}>
            <h4 className={styles.supportingContentItemHeader}>
              {x.metadata.file}
            </h4>
            <p className={styles.supportingContentItemText}>{x.pageContent}</p>
          </li>
        );
      })}
    </ul>
  );
};
