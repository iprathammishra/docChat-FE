import { Stack, TextField, setIconOptions } from "@fluentui/react";
import styles from "./ResearchInput.module.css";
import { Send28Filled } from "@fluentui/react-icons";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { researchApi } from "../../api";

const ResearchInput = ({ setReport, setCompany, setIsLoading, isLoading, setResearchId }) => {
  const [input, setInput] = useState({
    company: "",
    url: "",
  });

  const maxHeight = 300;
  const textAreaStyle = {
    maxHeight: `${maxHeight}px`,
    height: "auto",
    overflowY: "auto",
    border: "1px solid #a9a9a969",
    borderRadius: "5px",
  };

  const getAnswer = async () => {
    if (!input.url && !input.company) {
      return;
    }
    setIsLoading(true);
    const id = uuidv4();
    setResearchId(id);
    setReport("");
    setCompany(input.company);
    setInput({ company: "", url: "" });
    try {
      const res = await researchApi(input, id);
      setReport(res.answer);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Stack horizontal className={styles.questionInputContainer}>
      <TextField
        className={styles.questionInputTextArea}
        placeholder="Company's name"
        style={textAreaStyle}
        multiline
        resizable={false}
        borderless
        maxLength={100}
        value={input.company}
        onChange={(e) =>
          setInput((prev) => ({ ...prev, company: e.target.value }))
        }
      />
      <TextField
        className={styles.questionInputTextArea}
        placeholder="Company's Website"
        style={textAreaStyle}
        multiline
        resizable={false}
        borderless
        maxLength={200}
        value={input.url}
        onChange={(e) => setInput((prev) => ({ ...prev, url: e.target.value }))}
      />
      <div className={styles.questionInputButtonsContainer}>
        <div
          className={`${styles.questionInputSendButton} ${
            !input.company || !input.url || isLoading
              ? styles.questionInputSendButtonDisabled
              : ""
          }`}
          aria-label="Ask question button"
          onClick={getAnswer}
        >
          <Send28Filled primaryFill="rgba(115, 118, 225, 1)" />
        </div>
      </div>
    </Stack>
  );
};

export default ResearchInput;
