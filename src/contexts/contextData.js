import React, { createContext, useState } from "react";

const userStored = localStorage.getItem("userId");

const ContextData = createContext({
  userId: userStored || "",
  setUserId: () => {},
  user: {},
  setUser: () => {},
});

export const ContextDataProvider = (props) => {
  const [userId, setUserId] = useState(userStored || "");
  const [user, setUser] = useState({});

  return (
    <ContextData.Provider
      value={{
        userId,
        setUserId,
        user,
        setUser,
      }}
    >
      {props.children}
    </ContextData.Provider>
  );
};
export default ContextData;
