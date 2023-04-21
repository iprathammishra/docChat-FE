import React, { useEffect, useState } from "react";
import styles from "./OneShot.module.css";

const EXAMPLES = [
  {
    text: "What are the services provided by Gutenberg?",
    type: "PR",
  },
  {
    text: "What is the media approach and strategy of Gutenberg?",
    type: "Content",
  },
  {
    text: "What are Gutenberg's values?",
    type: "About Us",
  },
];

const TYPES = ["Type", "PR", "Content", "About Us"];

const PromptsList = () => {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(EXAMPLES);
  const [searched, setSearched] = useState(filtered);

  useEffect(() => {
    // console.log(filtered);
    if (search === "") setSearched([...filtered]);
    else {
      const searchedPrompts = filtered.filter((prompt) =>
        prompt.text.toLowerCase().includes(search.toLowerCase())
      );
      setSearched([...searchedPrompts]);
    }
  }, [search, filtered]);

  const handleFilter = (e) => {
    const value = e.target.value;
    let filteredPrompts;
    if (value === "type") filteredPrompts = EXAMPLES;
    else
      filteredPrompts = EXAMPLES.filter(
        (prompt) => prompt.type.toLowerCase() === value
      );
    setFiltered([...filteredPrompts]);
  };

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
        <select
          onChange={handleFilter}
          className={styles.filter}
          name="type"
          id="type"
        >
          {TYPES.map((type, i) => (
            <option key={i} value={type.toLowerCase()}>
              {type}
            </option>
          ))}
        </select>
      </div>
      {searched.map((example, i) => (
        <div className={styles.promptContainer}>
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
          <div key={i} className={styles.prompt}>
            {example.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromptsList;
