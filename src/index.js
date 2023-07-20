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
import NoPage from "./pages/NoPage";
import Chat from "./pages/chat/Chat";
import Navbar from "./components/Navbar";
import axios from "axios";
import { BASE_URL } from "./utils/config";
import { ContextDataProvider } from "./contexts/contextData.js";
import { api } from "./api/interceptor";

initializeIcons();

export default function App() {
  const { setUser, setUserId } = useContext(ContextData);
  const navRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0 } // Adjust the threshold value if needed
    );

    if (navRef.current) {
      observer.observe(navRef.current);
    }

    return () => {
      if (navRef.current) {
        observer.unobserve(navRef.current);
      }
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

  return (
    <>
      {userId ? (
        <Router>
          <div ref={navRef} />
          <Navbar />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route
                path="/"
                element={<Chat navRef={navRef} isVisible={isVisible} />}
              />{" "}
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </Router>
      ) : (
        <Router>
          <Routes>
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/auth/signup" replace />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ContextDataProvider>
    <App />
  </ContextDataProvider>
);
