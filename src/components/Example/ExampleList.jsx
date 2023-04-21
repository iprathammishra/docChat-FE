import { Example } from "./Example";

import styles from "./Example.module.css";

const EXAMPLES = [
  {
    text: "What are the services provided by Gutenberg?",
    value: "What are the services provided by Gutenberg?",
  },
  {
    text: "What is the media approach and strategy of Gutenberg?",
    value: "What is the media approach and strategy of Gutenberg?",
  },
];

export const ExampleList = ({ onExampleClicked }) => {
  return (
    <ul className={styles.examplesNavList}>
      {EXAMPLES.map((x, i) => (
        <li key={i}>
          <Example text={x.text} value={x.value} onClick={onExampleClicked} />
        </li>
      ))}
    </ul>
  );
};
