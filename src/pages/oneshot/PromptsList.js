import React, { useEffect, useState } from "react";
import styles from "./OneShot.module.css";

const EXAMPLES = [
  {
    text: "List down all the press releases for Mphasis between April 2022 and Dec 2022 in points.",
    type: "PR",
  },
  // {
  //   text: "List all the topics of bylines published for Mpahsis",
  //   type: "PR",
  // },
  {
    text: "List down the topics of bylines written for Mphasis and their key themes.",
    type: "PR",
  },
  {
    text: "List all the keywords of press releases published in a time period between April 2022 and December 2022 in points.",
    type: "PR",
  },
  {
    text: "How many bylines were released under Forbes for Mphasis?",
    type: "PR",
  },
  {
    text: "How many press releases were released under Cision for Mphasis?",
    type: "PR",
  },
  {
    text: "What were the key themes, topics, industries of the releases between April 2022 and December 2022?",
    type: "PR",
  },
  {
    text: "How does Gutenberg value their customers?",
    type: "About Us",
  },
  {
    text: "You are the best SEO optimized content writer with an experience of 20 years. You have been tasked to write an interesting and engaging press release on the topic of 'The Growing Technology in Metaverse and Blockchain Sector in 2023' for the company Trail and tone should be very professional. Use proper headers and subheadings. The press release that you write should be with a same structure and tone as of previous Mphasis press releases but don't use the direct context from the Mphasis press releases.",
    type: "Content",
  },
  {
    text: "You are the best SEO optimized case study writer with an experience of 20 years. You have been tasked to write an interesting and engaging case study for company Trail which is a Fintech company and the tone should be very professional. Use proper headers and subheadings. The case study that you write should be with a same structure and tone as of previous Gutenberg case studies but don't use the direct context from the Gutenberg case studies.",
    type: "Content",
  },
];

const TYPES = ["Type", "PR", "Content", "About Us"];

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
