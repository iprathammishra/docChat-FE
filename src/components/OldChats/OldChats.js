import React, { useContext, useEffect, useState } from "react";
import styles from "./OldChats.module.css";
import { BASE_URL } from "../../utils/config";
import { api } from "../../api/interceptor";
import { Icon } from "@fluentui/react";
import ContextData from "../../contexts/contextData";

const OldChats = ({
  setAnswers,
  lastQuestionRef,
  setCompany,
  setSummary,
  setReport,
  setResearchId,
  selectedType,
}) => {
  const [oldChats, setOldChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { setMode } = useContext(ContextData);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    const res = await api.get(`${BASE_URL}/chat/getall`);
    const data = res.data;
    let history = [];
    const rfpHistory = data.history.rfp.map((rfp) => ({ ...rfp, type: "rfp" }));
    const researchHistory = data.history.research.map((research) => ({
      ...research,
      type: "research",
    }));
    history = [...rfpHistory, ...researchHistory];
    history.sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
    setIsLoading(false);
    setOldChats(history);
  };

  const handleChatClick = (i, type) => {
    setSelectedChat(i);
    const chat = oldChats[i];
    if (type === "rfp") {
      const conversation = chat.chat;
      const obj = {
        id: chat.chatId,
        chat: conversation,
      };
      const chatLength = conversation.length;
      lastQuestionRef.current = conversation[chatLength - 1]?.user;
      setAnswers({ ...obj });
      setSummary(chat?.summary?.summary ?? "");
      setMode("rfp");
    } else {
      setMode("research");
      setReport(chat.answer);
      setResearchId(chat.chatId);
    }
    setCompany(chat.name);
  };

  const deleteChat = async (e, id, type) => {
    e.stopPropagation();
    setCompany("");
    setAnswers({ chat: [] });
    setOldChats(oldChats.filter((chat) => chat.chatId !== id));
    lastQuestionRef.current = "";
    if (type === "rfp") {
      await api.put(`${BASE_URL}/chat/delete/${id}`);
    } else {
      await api.put(`${BASE_URL}/research/delete/${id}`);
    }
  };

  return !isLoading ? (
    <div className={styles.container}>
      {oldChats.length !== 0 ? (
        oldChats
          .filter((chat) => {
            if (selectedType === "all") return chat;
            return chat.type === selectedType;
          })
          .map((chat, i) => {
            const date = new Date(chat.createdAt).toDateString();
            return (
              <div
                onClick={() => handleChatClick(i, chat.type)}
                key={i}
                className={
                  selectedChat !== i
                    ? `${styles.chatContainer}`
                    : `${styles.chatContainer} ${styles.selectedChat}`
                }
              >
                <div className={styles.details}>
                  <div className={styles.chat}>{chat.name}</div>
                  <div className={styles.date}>{date}</div>
                </div>
                <div className={styles.icons}>
                  {chat.type === "rfp" ? (
                    <Icon
                      className={`${styles.typeIcon} ${styles.icon}`}
                      iconName="ComplianceAudit"
                    />
                  ) : (
                    <Icon
                      className={`${styles.typeIcon} ${styles.icon}`}
                      iconName="Financial"
                    />
                  )}
                  <Icon
                    className={`${styles.deleteIcon} ${styles.icon}`}
                    iconName="Delete"
                    onClick={(e) => deleteChat(e, chat.chatId, chat.type)}
                  />
                </div>
              </div>
            );
          })
      ) : (
        <p>No chats found!</p>
      )}
    </div>
  ) : (
    <div style={{ marginTop: "20px" }}>Loading...</div>
  );
};

export default OldChats;
