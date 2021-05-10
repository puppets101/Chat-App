import React, { ChangeEvent, CSSProperties, useContext, useState } from "react";
import { NetworkContext, User } from "../context/NetworkContext";
import { buttonStyle, inputStyle } from "../styles";

interface Message {
  user: User | undefined;
  text: string;
}

function ChatFeed() {
  const network = useContext(NetworkContext);
  const [message, setMessage] = useState<Message>({
    user: network.currentUser,
    text: "",
  });

  const handleNewMessageInput = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage({ ...message, text: e.target.value });
  };

  const handleSendMessage = () => {
    network.sendMessage(message.text);
    setMessage({ user: network.currentUser, text: "" });
  };

  return (
    <div style={root}>
      <div style={messageFeed}>
        {network.messagesInRoom.map(({ author, body }) => (
          <div key={Math.random() * 100} style={messageStyle}>
            <p style={avatar}>{author.username}</p>
            <p style={textMessage}>{body}</p>
          </div>
        ))}
      </div>
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
        <button style={buttonStyle} onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

const root: CSSProperties = {
  background: "red",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  width: "100%",
};

const inputArea: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  backgroundColor: "grey",
  bottom: "0",
  width: "100%",
};
const label: CSSProperties = {
  fontSize: "0.8rem",
};

const messageFeed: CSSProperties = {};

const messageStyle: CSSProperties = {
  padding: ".5rem",
  backgroundColor: "lightgrey",
  display: "flex",
  flexDirection: "column",
};

const avatar: CSSProperties = {
  margin: "0",
  fontWeight: "bold",
};

const textMessage: CSSProperties = {
  padding: ".5rem",
  margin: "0",
};

export default ChatFeed;
