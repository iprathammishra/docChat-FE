import React, { useContext, useEffect, useState } from "react";
import { Copy20Regular, Delete20Regular } from "@fluentui/react-icons";
import ContextData from "../../contexts/contextData";
import styles from "./OneShot.module.css";
import { addPromptApi, deletePromptApi, fetchPromptsApi } from "../../api/api";

const PromptsList = () => {
  const [search, setSearch] = useState("");
  const [prompt, setPrompt] = useState("");
  const [prompts, setPrompts] = useState([]);
  const [searched, setSearched] = useState([]);
  const { userId, user } = useContext(ContextData);

  useEffect(() => {
    fetchAllPrompts();
  }, []);

  const fetchAllPrompts = async () => {
    const fetchedPrompts = await fetchPromptsApi();
    setPrompts(fetchedPrompts);
  };

  useEffect(() => {
    if (search === "") setSearched([...prompts]);
    else {
      const searchedPrompts = prompts.filter(
        (prompt) =>
          prompt.prompt.toLowerCase().includes(search.toLowerCase()) ||
          prompt.createdBy.name.toLowerCase().includes(search.toLowerCase())
      );
      setSearched([...searchedPrompts]);
    }
  }, [search, prompts]);

  const addPrompt = async (e) => {
    e.preventDefault();
    const newPrompt = {
      prompt,
      createdBy: {
        name: user.name,
        id: userId,
      },
    };
    await addPromptApi(newPrompt);
    setPrompts([newPrompt, ...prompts]);
    setPrompt("");
  };

  const deletePrompt = async (id) => {
    await deletePromptApi(id);
    const updatedPrompts = prompts.filter((prompt) => prompt._id !== id);
    setPrompts(updatedPrompts);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className={styles.promptList}>
      <form onSubmit={addPrompt} className={styles.prompt_form}>
        <textarea
          placeholder="Write your prompt here..."
          name="prompt"
          className={styles.prompt_textarea}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        ></textarea>
        <input type="submit" className={styles.add_btn} value="Add Prompt +" />
      </form>
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
          <Copy20Regular
            style={{
              position: "absolute",
              right: "5px",
              top: "5px",
              color: "grey",
              cursor: "pointer",
            }}
          />
          {userId === example.createdBy.id && (
            <Delete20Regular
              style={{
                position: "absolute",
                right: "27px",
                top: "5px",
                color: "grey",
                cursor: "pointer",
              }}
              onClick={() => deletePrompt(example._id)}
            />
          )}
          <div className={styles.prompt}>{example.prompt}</div>
          <div className={styles.prompt_by}>{example.createdBy.name}</div>
        </div>
      ))}
    </div>
  );
};

export default PromptsList;
