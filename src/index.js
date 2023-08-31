import React, { useContext, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import { initializeIcons } from "@fluentui/react";
import "./index.css";
import Layout from "./pages/layout/Layout";
import ContextData from "./contexts/contextData";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Chat from "./pages/chat/Chat";
import Navbar from "./components/Navbar";
import { EventType, PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { BASE_URL, REACT_APP_BASE_URL } from "./utils/config";
import { ContextDataProvider } from "./contexts/contextData.js";
import { api } from "./api/interceptor";
import axios from "axios";
import Maintenance from "./pages/Maintenance/Maintenance";

const pca = new PublicClientApplication({
  auth: {
    clientId: "9948a412-e2e9-47a2-a934-e081824ae2e9",
    authority:
      "https://login.microsoftonline.com/0e89a1b1-87ef-4299-a101-a286ea67bdcf",
    redirectUri: REACT_APP_BASE_URL,
  },
});

initializeIcons();

export default function App() {
  const { setUser, setUserId } = useContext(ContextData);
  const navRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const { instance } = useMsal();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    setUserId(userId);
    const handleScroll = () => {
      const divElement = navRef.current;
      if (divElement) {
        const { top, bottom } = divElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if any part of the element is within the viewport
        const isVisibleOnScreen = top < windowHeight && bottom >= 0;
        setIsVisible(isVisibleOnScreen);
      }
    };

    window.addEventListener("scroll", handleScroll);

    const callback = pca.addEventCallback(async (event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS) {
        const account = event.payload.account;
        pca.setActiveAccount(account);
        const response = await axios.post(`${BASE_URL}/auth/login`, {
          email: account.username,
          name: account.name,
          loginType: "ms-social",
        });

        const { accessToken, userId } = response.data;

        if (userId) {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("userId", userId);
          localStorage.setItem("loginType", "ms");
          setUserId(userId);
        }
      }
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      pca.removeEventCallback(callback);
    };
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUser();
      setUserId(userId);
    }
  }, [userId]);

  const fetchUser = async () => {
    const response = await api.get(`${BASE_URL}/auth/${userId}`);
    const { user } = response.data;
    setUser(user[0]);
  };

  const handleMsSignin = () => {
    localStorage.setItem("loginType", "ms");
    instance.loginPopup({
      scopes: ["user.read"],
    });
  };

  return (
    <>
      <Maintenance />
      {/* {userId ? (
        <Router>
          <div ref={navRef} />
          <Navbar />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route
                path="/"
                element={<Chat navRef={navRef} isVisible={isVisible} />}
              />{" "}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      ) : (
        <Router>
          <Routes>
            <Route
              path="/auth/signup"
              element={<Signup handleMsSignin={handleMsSignin} />}
            />
            <Route
              path="/auth/login"
              element={<Login handleMsSignin={handleMsSignin} />}
            />
            <Route path="*" element={<Navigate to="/auth/signup" replace />} />
          </Routes>
        </Router>
      )} */}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ContextDataProvider>
    <MsalProvider instance={pca}>
      <App />
    </MsalProvider>
  </ContextDataProvider>
);
