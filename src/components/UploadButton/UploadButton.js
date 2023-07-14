import React, { useContext, useRef, useState } from "react";
import { ArrowUpload24Regular } from "@fluentui/react-icons";
import { Text } from "@fluentui/react";
import { useId, useBoolean } from "@fluentui/react-hooks";
import { getTheme, Modal } from "@fluentui/react";
import { IconButton } from "@fluentui/react/lib/Button";
import styles from "./Upload.module.css";
import ContextData from "../../contexts/contextData";
import { v4 as uuidv4 } from "uuid";
import { uploadFilesApi } from "../../api";

const UploadButton = ({
  className,
  selectedFiles,
  setSelectedFiles,
  setCompany,
  answers,
}) => {
  const [filesLoaded, setFilesLoaded] = useState(true);
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);
  const [active, setActive] = useState("local");
  const [companyInput, setCompanyInput] = useState("");
  const { userId } = useContext(ContextData);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);
  const closeBtnRef = useRef(null);
  const titleId = useId("title");

  const handleFilesUpload = async (e) => {
    e.preventDefault();

    if (answers.chat.length === 0) {
      answers["id"] = uuidv4();
    }
    setFilesLoaded(false);

    let formData = new FormData(formRef.current);
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }
    formData.append("chatId", answers.id);

    let status;
    try {
      status = await uploadFilesApi(formData, userId);
    } catch (e) {
      alert(e);
      setFilesLoaded(true);
      hideModal();
      setSelectedFiles([]);
      return;
    }

    if (status <= 299) {
      setFilesLoaded(true);
      hideModal();
      setSelectedFiles([]);
    }

    setCompany(companyInput);
    setCompanyInput("");
  };

  const handleFileInputChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const removeFile = (i) => {
    const tempArr = selectedFiles;
    tempArr.splice(i, 1);
    setSelectedFiles([...tempArr]);
  };

  return (
    <div className={`${className ?? ""}`}>
      <div onClick={showModal} className={styles.container}>
        <ArrowUpload24Regular />
        <Text>{"Upload Files"}</Text>
      </div>
      <Modal
        titleAriaId={titleId}
        isOpen={isModalOpen}
        onDismiss={hideModal}
        isBlocking={false}
        containerClassName={styles.modal_container}
      >
        <div className={styles.close_icon}>
          <IconButton
            ref={closeBtnRef}
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close popup modal"
            onClick={hideModal}
          />
        </div>
        <div className={styles.modal_header}>
          <p
            onClick={() => setActive("local")}
            className={active === "local" ? `${styles.active}` : ""}
          >
            Local Files
          </p>
        </div>
        <hr />
        {/* <div> */}
        <form
          ref={formRef}
          onSubmit={handleFilesUpload}
          className={styles.upload_section}
        >
          <input
            type="text"
            name="company"
            value={companyInput}
            placeholder="Company's name..."
            onChange={(e) => setCompanyInput(e.target.value)}
            className={styles.company_input}
          />
          <div
            className={styles.browse_btn}
            onClick={() => fileInputRef.current.click()}
          >
            Browse
          </div>
          <input
            ref={fileInputRef}
            onChange={handleFileInputChange}
            type="file"
            multiple
            style={{ display: "none" }}
            accept=".doc,.docx,.pdf"
          />
          {selectedFiles.length !== 0 &&
            selectedFiles.map((file, i) => {
              return (
                <div key={i} className={styles.added_file}>
                  <p className={styles.file_name}>{file.name}</p>
                  <IconButton
                    onClick={() => removeFile(i)}
                    iconProps={cancelIcon}
                  />
                </div>
              );
            })}
          {!filesLoaded && (
            <button className={`${styles.loaders} ${styles.submit_btn}`}>
              <div className={styles.loader}>
                <span></span>
              </div>
            </button>
          )}
          {selectedFiles.length !== 0 && filesLoaded && companyInput && (
            <button type="submit" className={styles.submit_btn}>
              Submit
            </button>
          )}
        </form>
        {/* </div> */}
      </Modal>
    </div>
  );
};

const cancelIcon = { iconName: "Cancel" };

const theme = getTheme();

const iconButtonStyles = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: "auto",
    marginTop: "4px",
    marginRight: "2px",
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};

export default UploadButton;
