import React from "react";
import ReactDOM from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { initializeIcons } from "@fluentui/react";

import "./index.css";

import Layout from "./pages/layout/Layout";
import NoPage from "./pages/NoPage";
import OneShot from "./pages/oneshot/OneShot";
import Chat from "./pages/chat/Chat";
import Linkedin from "./pages/linkedin/Linkedin";
import Navbar from "./components/Navbar";

initializeIcons();

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
