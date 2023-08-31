import React from "react";
import styles from "./Maintenance.module.css";

const Maintenance = () => {
  return (
    <div className={styles.container}>
      <img
        src="https://cdnl.iconscout.com/lottie/premium/thumb/website-under-maintenance-5690953-4747761.gif"
        alt="maintenance"
      />
      <h1>Oops! The site is under maintenance.</h1>
    </div>
  );
};

export default Maintenance;
