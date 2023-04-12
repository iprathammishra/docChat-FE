import { Text } from "@fluentui/react";
import { Delete24Regular } from "@fluentui/react-icons";

import styles from "./ClearChatButton.module.css";

export const ClearChatButton = ({ className, disabled, onClick }) => {
    return (
        <div className={`${styles.container} ${className ?? ""} ${disabled && styles.disabled}`} onClick={onClick}>
            <Delete24Regular />
            <Text>{"Clear chat"}</Text>
        </div>
    );
};
