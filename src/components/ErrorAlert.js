import { MessageBar, MessageBarType } from "@fluentui/react";
import React from "react";

const ErrorAlert = ({ message }) => {
  return (
    <MessageBar delayedRender={false} messageBarType={MessageBarType.error}>
      {message}
    </MessageBar>
  );
};

export default ErrorAlert;
