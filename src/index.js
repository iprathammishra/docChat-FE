import React, { useContext, useEffect } from "react";
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
import Linkedin from "./pages/linkedin/Linkedin";
import Navbar from "./components/Navbar";
import axios from "axios";
import { ContextDataProvider } from "./contexts/contextData.js";

initializeIcons();

const BASE_URL = "http://localhost:9000";

export default function App() {
  const { user, setUser, userId } = useContext(ContextData);

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
          <Navbar />
          <Routes>
            <Route path="/linkedin" element={<Linkedin />} />
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Chat />} />{" "}
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
