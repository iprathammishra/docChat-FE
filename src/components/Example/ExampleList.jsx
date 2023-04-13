import { Example } from "./Example";

import styles from "./Example.module.css";

const EXAMPLES = [
  {
    text: "List down the companies and their respective retainer fee that Gutenberg has charged them.",
    value:
      "List down the companies and their respective retainer fee that Gutenberg has charged them.",
  },
  {
    text: "What are the services provided by Gutenberg?",
    value: "What are the services provided by Gutenberg?",
  },
  {
    text: "Who is Mudit Gupta and how can help an organization?",
    value: "Who is Mudit Gupta and how can help an organization?",
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
