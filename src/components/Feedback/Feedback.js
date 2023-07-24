import React, { useState } from "react";
import { Modal, Slider, mergeStyleSets } from "@fluentui/react";
import styles from "./Feedback.module.css";
import { feedbackApi } from "../../api/api";

const Feedback = ({
  isFeedbackModalOpen,
  hideFeedbackModal,
  type,
  feedbackHandler,
}) => {
  const [sliderValue, setSliderValue] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [thanks, setThanks] = useState(false);
  const sliderOnChange = (value) => setSliderValue(value);

  const handleSubmitFeedback = async () => {
    try {
      if (type === "hours") {
        await feedbackApi(type, { hours: sliderValue });
      } else {
        await feedbackHandler("dislike", feedback);
      }
      setThanks((prev) => !prev);
      await new Promise((resolve) =>
        setTimeout(() => {
          hideFeedbackModal();
          setSliderValue(0);
          setFeedback("");
          resolve();
        }, 2000)
      );
      // Just for UX
      setTimeout(() => {
        setThanks((prev) => !prev);
      }, 200);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <Modal
      isOpen={isFeedbackModalOpen}
      onDismiss={() => {
        hideFeedbackModal();
        // Just for UX
        setTimeout(() => {
          setSliderValue(0);
        }, 500);
      }}
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
            <>
              <label htmlFor="feedback">
                Dislike Feedback & Improvement Suggestions{" "}
                <span style={{ color: "red" }}>*</span>
                <textarea
                  name="feedback"
                  className={styles.feedbackInput}
                  onChange={(e) => setFeedback(e.target.value)}
                  value={feedback}
                ></textarea>
              </label>
            </>
          )}
          <div className={styles.btnContainer}>
            <button
              style={{ width: "200px", marginTop: "20px" }}
              onClick={handleSubmitFeedback}
              disabled={type === "answer" && !feedback}
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
