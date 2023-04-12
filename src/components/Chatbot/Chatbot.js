import React, { useState } from "react";
import "./Chatbot.css"; // Import CSS file for styling

function Chatbot() {
  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState(null);
  console.log(file);
  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const handleOneDriveUpload = () => {
    // Code to handle OneDrive file upload
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-button">Open Chatbot</button>
      <div className="chatbot-box">
        <div className="chatbot-message-container">
          <div className="chatbot-message">Hello, how can I help you?</div>
        </div>
        <div className="chatbot-input-container">
          <input
            type="text"
            placeholder="Type your message here"
            value={inputText}
            onChange={handleInputChange}
            className="chatbot-input"
          />
          <div className="chatbot-file-upload">
            <label htmlFor="local-file-upload">Local File Upload</label>
            <input
              type="file"
              id="local-file-upload"
              onChange={handleFileUpload}
            />
            <button onClick={handleOneDriveUpload}>OneDrive Upload</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
