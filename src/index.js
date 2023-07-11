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
import OneShot from "./pages/oneshot/OneShot";
import Chat from "./pages/chat/Chat";
import Navbar from "./components/Navbar";
import axios from "axios";
import { BASE_URL } from "./utils/config";
import { ContextDataProvider } from "./contexts/contextData.js";

initializeIcons();

export default function App() {
  const { setUser, userId } = useContext(ContextData);
  const navRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

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
    }
  }, [userId]);

  const fetchUser = async () => {
    const response = await axios.get(`${BASE_URL}/auth/${userId}`);
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
              {/* use 'path' instead of 'index' */}
              <Route path="qa" element={<OneShot />} />
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
  <React.StrictMode>
    <ContextDataProvider>
      <App />
    </ContextDataProvider>
  </React.StrictMode>
);
