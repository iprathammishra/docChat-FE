import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import ContextData from "../contexts/contextData";
import { useBoolean } from "@fluentui/react-hooks";
import { getTheme, mergeStyleSets, FontWeights, Modal } from "@fluentui/react";
import { QuestionCircle24Regular } from "@fluentui/react-icons";

const Navbar = () => {
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);
  const { setUserId } = useContext(ContextData);

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    setUserId("");
  };

  return (
    <header>
      <img src="GutenbergLogo.png" alt="Logo" className="logo" />
      <div className="nav-items">
        <NavLink to="/">
          <p onClick={showModal} className="nav-item nav-chat">
            <QuestionCircle24Regular />
          </p>
          <Modal
            isOpen={isModalOpen}
            onDismiss={hideModal}
            isBlocking={false}
            containerClassName={contentStyles.container}
          >
            <iframe
              src="https://app.tango.us/app/embed/ff4e3e97-6555-4903-89c7-718591acdb90?iframe=true"
              sandbox="allow-scripts allow-top-navigation-by-user-activation allow-popups allow-same-origin"
              security="restricted"
              title="Navigating Login, Uploading Files, Asking Questions, and Managing Account in the Knowledge Platform"
              width="100%"
              height="100%"
              referrerpolicy="strict-origin-when-cross-origin"
              frameborder="0"
              webkitallowfullscreen="webkitallowfullscreen"
              mozallowfullscreen="mozallowfullscreen"
              allowfullscreen="allowfullscreen"
              style={{ width: "100%", height: "500px" }}
            ></iframe>
          </Modal>
        </NavLink>
        <i
          title="Log Out"
          style={{ color: "white", cursor: "pointer" }}
          onClick={logout}
          className="fa-solid fa-right-from-bracket"
        ></i>
      </div>
    </header>
  );
};

const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    width: "500px",
    borderRadius: "30px",
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "stretch",
    backgroundColor: "transparent",
    boxShadow: "none",
  },
  header: [
    theme.fonts.xLargePlus,
    {
      flex: "1 1 auto",
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: "flex",
      alignItems: "center",
      fontWeight: FontWeights.semibold,
      padding: "12px 12px 14px 24px",
    },
  ],
  heading: {
    color: theme.palette.neutralPrimary,
    fontWeight: FontWeights.semibold,
    fontSize: "inherit",
    margin: "0",
  },
  body: {
    flex: "4 4 auto",
    padding: "0 24px 24px 24px",
    overflowY: "hidden",
    selectors: {
      p: { margin: "14px 0" },
      "p:first-child": { marginTop: 0 },
      "p:last-child": { marginBottom: 0 },
    },
  },
});

export default Navbar;
