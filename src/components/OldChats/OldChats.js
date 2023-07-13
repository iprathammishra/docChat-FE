import React, { useEffect, useState } from "react";
import styles from "./OldChats.module.css";
import { Delete20Regular } from "@fluentui/react-icons";
import { BASE_URL } from "../../utils/config";
import axios from "axios";

const OldChats = ({ userId, setAnswers, lastQuestionRef, setCompany }) => {
  const [oldChats, setOldChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    const res = await axios.get(`${BASE_URL}/chat/getall/${userId}`);
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
    await axios.put(`${BASE_URL}/chat/delete/${id}`);
  };

  return (
    <div className={styles.container}>
      {oldChats.length !== 0 ? (
        oldChats.map((chat, i) => (
          <div
            onClick={() => handleChatClick(i)}
            key={i}
            className={
              selectedChat !== i
                ? `${styles.chatContainer}`
                : `${styles.chatContainer} ${styles.selectedChat}`
            }
          >
            <div className={styles.chat}>{chat.name}</div>
            <Delete20Regular onClick={(e) => deleteChat(e, chat.chatId)} />
          </div>
        ))
      ) : (
        <p>No chats found!</p>
      )}
    </div>
  );
};

export default OldChats;
