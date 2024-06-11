import React from "react";
import MessageItemWrapper from "../MessageItemWrapper";
import { MessagesUnion } from "../../../models/message.model";
import { MessageItemBaseProps } from "../types";

type MessageItemGroupPropsType = {
  messages: MessagesUnion[];
} & MessageItemBaseProps;

const MessageItemGroup: React.FC<MessageItemGroupPropsType> = ({
  messages,
  ...rest
}) => {
  return (
    <MessageItemWrapper {...rest}>
      <div>Group</div>
    </MessageItemWrapper>
  );
};

export default MessageItemGroup;
