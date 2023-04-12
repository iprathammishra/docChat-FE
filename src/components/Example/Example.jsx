import styles from "./Example.module.css";

export const Example = ({ text, value, onClick }) => {
    return (
        <div className={styles.example} onClick={() => onClick(value)}>
            <p className={styles.exampleText}>{text}</p>
        </div>
    );
};
