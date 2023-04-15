import { Outlet, NavLink, Link } from "react-router-dom";

import github from "../../assets/github.svg";
import "../../pages/linkedin/Linkedin.css";
import styles from "./Layout.module.css";

const Layout = () => {
  return (
    <div className={styles.layout}>
      <Outlet />
    </div>
  );
};

export default Layout;
