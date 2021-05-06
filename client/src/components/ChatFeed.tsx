import React, { ChangeEvent, CSSProperties, useContext, useState } from "react";
import { NetworkContext, User } from "../context/NetworkContext";
import { buttonStyle, inputStyle } from "../styles";

interface Message {
  user: User | undefined;
  text: string;
}

function ChatFeed() {
  const network = useContext(NetworkContext);

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<Message>({
    user: network.currentUser,
    text: "",
  });

  const handleNewMessageInput = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage({ ...message, text: e.target.value });
  };

  console.log(message);

  return (
    <div style={root}>
      <div style={inputArea}>
        <label style={label} htmlFor="username">
          Message
        </label>
        <input
          style={inputStyle}
          type="text"
          name="message"
          value={message.text}
          onChange={handleNewMessageInput}
        />
        <button style={buttonStyle}>Send</button>
      </div>
    </div>
  );
}

const root: CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
};

const inputArea: CSSProperties = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#f3f3f3",
  bottom: "5%",
  width: "100%",
};
const label: CSSProperties = {
  fontSize: "0.8rem",
};

export default ChatFeed;
