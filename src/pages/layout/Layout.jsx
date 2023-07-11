import { Outlet } from "react-router-dom";

// import "../../pages/linkedin/Linkedin.css";
import styles from "./Layout.module.css";

const Layout = () => {
  return (
    <div className={styles.layout}>
      <Outlet />
    </div>
  );
};

export default Layout;
