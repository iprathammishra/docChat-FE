import React, { useEffect, useState } from "react";
import styles from "./Popup.module.css";
import { ProgressIndicator } from "@fluentui/react";

const intervalDelay = 25;
const targetPercent = 0.99;
const totalSeconds = 2.5;
const intervalsRequired = Math.ceil((totalSeconds * 1000) / intervalDelay);
const intervalIncrement = targetPercent / intervalsRequired;

const Popup = ({ message }) => {
  const [percentComplete, setPercentComplete] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPercentComplete(
        (prevPercentComplete) => prevPercentComplete + intervalIncrement
      );
    }, intervalDelay);

    return () => {
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (percentComplete >= targetPercent) {
      setPercentComplete(targetPercent);
    }
  }, [percentComplete]);

  return (
    <div className={`${styles.popupContainer}`}>
      <div className={styles.message}>{message}</div>

      <ProgressIndicator
        className={styles.progressBar}
        percentComplete={percentComplete}
        barHeight={4}
      />
    </div>
  );
};

export default Popup;
