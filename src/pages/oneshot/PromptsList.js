import React, { useEffect, useState } from "react";
import styles from "./OneShot.module.css";

const EXAMPLES = [
  {
    text: "Can you list down and elaborate on tasks given in specific scope of services?",
    type: "PR",
  },
  {
    text: "Can you provide a detailed summary of the RFP for marketing for NYCEDC properties with proper headings and subheadings?",
    type: "PR",
  },
  {
    text: "What is the deadline for proposal submission?",
    type: "PR",
  },
  {
    text: "What is the deadline for asking clarification questions?",
    type: "PR",
  },
  {
    text: "What is the process for asking these questions? Is it via an email or website/procurement portal?",
    type: "PR",
  },
  {
    text: "Is there a pre-proposal or pre-bid meeting? Is it being held in-person / on-site? What date and time? Is a meeting link available?",
    type: "PR",
  },
  {
    text: "List the services / deliverables / scope of work.",
    type: "PR",
  },
  {
    text: "Does the RFP mention any availability of budgets or limits on budgets?",
    type: "About Us",
  },
  {
    text: "What are the qualification criteria for agencies bidding, applying or responding to this RFP?",
    type: "Content",
  },
  {
    text: "Is there an Earnest Money Deposit or RFP Processing Fee required?",
    type: "Content",
  },
  {
    text: "Is there a format for technical or financial proposal that the bidders need to follow?",
    type: "Content",
  },
  {
    text: "What are the objectives or goals or aims of this RFP?",
    type: "Content",
  },
  {
    text: "Is there a list of supporting documents that the agency should submit along with the technical or financial proposal?",
    type: "Content",
  },
];

const PromptsList = () => {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(EXAMPLES);
  const [searched, setSearched] = useState(filtered);

  useEffect(() => {
    if (search === "") setSearched([...filtered]);
    else {
      const searchedPrompts = filtered.filter((prompt) =>
        prompt.text.toLowerCase().includes(search.toLowerCase())
      );
      setSearched([...searchedPrompts]);
    }
  }, [search, filtered]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className={styles.promptList}>
      <div className={styles.filterContainer}>
        <input
          value={search}
          onChange={handleSearch}
          className={styles.searchbar}
          placeholder="Search prompts..."
        />
      </div>
      {searched.map((example, i) => (
        <div key={i} className={styles.promptContainer}>
          <i
            style={{
              position: "absolute",
              right: "10px",
              top: "10px",
              color: "grey",
              cursor: "pointer",
            }}
            onClick={async () => {
              await navigator.clipboard.writeText(example.text);
            }}
            className="fa-regular fa-copy"
          ></i>
          <div className={styles.prompt}>{example.text}</div>
        </div>
      ))}
    </div>
  );
};

export default PromptsList;
