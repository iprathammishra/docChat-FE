import styles from "./UserChatMessage.module.css";

export const UserChatMessage = ({ message }) => {
    return (
        <div className={styles.container}>
            <div className={styles.message}>{message}</div>
        </div>
    );
};
