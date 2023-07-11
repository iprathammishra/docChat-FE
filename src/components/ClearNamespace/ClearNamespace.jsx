import { Modal, Text } from "@fluentui/react";
import { Delete24Regular } from "@fluentui/react-icons";
import styles from "./ClearNamespace.module.css";

export const ClearNamespace = ({
  className,
  onClick,
  isModalOpen,
  hideModal,
}) => {
  return (
    <div>
      <div className={`${styles.container} ${className}`} onClick={onClick}>
        <Delete24Regular />
        <Text>{"Delete Documents"}</Text>
      </div>
      <Modal
        containerClassName={styles.modal}
        isOpen={isModalOpen}
        onDismiss={hideModal}
        isBlocking={true}
        isDarkOverlay={true}
      >
        <div className={styles.modalContent}>
          <div style={{ fontSize: "30px" }} className={styles.text}>
            Deleting Documents
          </div>
          <div className={styles.ldsRing}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
