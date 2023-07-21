import React, { useEffect, useState } from "react";
import styles from "./OldChats.module.css";
import { Delete20Regular } from "@fluentui/react-icons";
import { BASE_URL } from "../../utils/config";
import { api } from "../../api/interceptor";

const OldChats = ({ userId, setAnswers, lastQuestionRef, setCompany }) => {
  const [oldChats, setOldChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    const res = await api.get(`${BASE_URL}/chat/getall/${userId}`);
    setIsLoading(false);
    setOldChats(res.data);
  };

  const handleChatClick = (i) => {
    setSelectedChat(i);
    const chat = oldChats[i];
    const conversation = chat.chat;
    const obj = {
      id: chat.chatId,
      chat: conversation,
    };
    const chatLength = conversation.length;
    lastQuestionRef.current = conversation[chatLength - 1]?.user;
    setAnswers({ ...obj });
    setCompany(chat.name);
  };

  const deleteChat = async (e, id) => {
    e.stopPropagation();
    setCompany("");
    setAnswers({ chat: [] });
    setOldChats(oldChats.filter((chat) => chat.chatId !== id));
    lastQuestionRef.current = "";
    await api.put(`${BASE_URL}/chat/delete/${id}`);
  };

  return !isLoading ? (
    <div className={styles.container}>
      {oldChats.length !== 0 ? (
        oldChats.map((chat, i) => {
          const date = new Date(chat.createdAt).toDateString();
          return (
            <div
              onClick={() => handleChatClick(i)}
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
              <Delete20Regular onClick={(e) => deleteChat(e, chat.chatId)} />
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
