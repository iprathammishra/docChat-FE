import React, { createContext, useState } from "react";

const userStored = localStorage.getItem("userId");

const ContextData = createContext({
  userId: userStored || "",
  setUserId: () => {},
  user: {},
  setUser: () => {},
  mode: {},
  setMode: () => {},
});

export const ContextDataProvider = (props) => {
  const [userId, setUserId] = useState(userStored || "");
  const [user, setUser] = useState({});
  const [mode, setMode] = useState("rfp");

  return (
    <ContextData.Provider
      value={{
        userId,
        setUserId,
        user,
        setUser,
        mode,
        setMode,
      }}
    >
      {props.children}
    </ContextData.Provider>
  );
};
export default ContextData;
