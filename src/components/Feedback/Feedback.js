import React, { useState } from "react";
import { Modal, Slider, mergeStyleSets } from "@fluentui/react";
import styles from "./Feedback.module.css";
import { hoursSavedApi } from "../../api/api";

const Feedback = ({ isFeedbackModalOpen, hideFeedbackModal, type }) => {
  const [sliderValue, setSliderValue] = useState(0);
  const [thanks, setThanks] = useState(false);
  const sliderOnChange = (value) => setSliderValue(value);

  const handleSubmitFeedback = async () => {
    try {
      const res = await hoursSavedApi(type, sliderValue);
      if (res.status <= 299) {
        setThanks((prev) => !prev);
        setTimeout(() => {
          setThanks((prev) => !prev);
        }, 4000);
      }
      setSliderValue(0);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <Modal
      isOpen={isFeedbackModalOpen}
      onDismiss={hideFeedbackModal}
      isBlocking={false}
      containerClassName={contentStyles.container}
    >
      {thanks ? (
        <div className={styles.feedbackContainer}>
          <p style={{ textAlign: "center", fontSize: "30px" }}>
            Thanks for submitting your valuable feedback!
          </p>
        </div>
      ) : (
        <div className={styles.feedbackContainer}>
          {type === "hours" ? (
            <>
              <h3 style={{ textAlign: "center" }}>
                How many hours did you save this week?
              </h3>
              <p style={{ fontSize: "64px", textAlign: "center" }}>
                {sliderValue}
              </p>
              <Slider
                max={10}
                value={sliderValue}
                showValue={false}
                // eslint-disable-next-line react/jsx-no-bind
                onChange={sliderOnChange}
              />
            </>
          ) : (
            <></>
          )}
          <div className={styles.btnContainer}>
            <button
              style={{ width: "200px", marginTop: "20px" }}
              onClick={handleSubmitFeedback}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

const contentStyles = mergeStyleSets({
  container: {
    width: "500px",
    height: "350px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
  },
});

export default Feedback;
