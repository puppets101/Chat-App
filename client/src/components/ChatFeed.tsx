import React, {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { NetworkContext, User } from "../context/NetworkContext";
import {
  buttonStyle,
  flexColStart,
  flexRowStart,
  inputStyle,
  labelStyle,
  marginS,
} from "../styles";

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

  const handleUserIsTyping = (e: KeyboardEvent<HTMLInputElement>) => {
    network.handleUserIsTyping(true);
    if (message.text === "" || e.key === "Enter") {
      network.handleUserIsTyping(false);
    }
    if (e.key === "Enter" && message.text.length) {
      handleSendMessage();
    }
  };

  const messageRef = useRef<HTMLParagraphElement>(null);

  const handleSendMessage = () => {
    network.sendMessage(message.text);
    setMessage({ user: network.currentUser, text: "" });
    network.handleUserIsTyping(false);
    if (messageRef.current) {
      messageRef.current.scrollIntoView(false);
    }
  };

  return (
    <div style={root}>
      <div style={{ ...flexColStart, ...messageFeed }}>
        {network.messagesInRoom.map(({ author, body }) => (
          <div ref={messageRef} key={Math.random() * 100} style={messageStyle}>
            <p style={avatar}>{author.username}</p>
            <p style={{ ...messageBody }}>{body}</p>
          </div>
        ))}
        {network.whoIsTyping ? <span>{network.whoIsTyping}</span> : null}
      </div>
      <div style={{ ...inputArea, ...flexRowStart }}>
        <input
          autoFocus
          style={{ ...inputStyle, flex: 1 }}
          type="text"
          name="message"
          value={message.text}
          onKeyUp={handleUserIsTyping}
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
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "baseline",
  alignItems: "baseline",
  width: "100%",
  flex: 1,
};

const messageFeed: CSSProperties = {
  overflowY: "auto",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
};

const inputArea: CSSProperties = {
  position: "absolute",
  backgroundColor: "grey",
  bottom: 0,
  left: 0,
  right: 0,
  padding: "2rem 0.5rem 1rem 0.5rem",
  flex: 1,
};

const messageStyle: CSSProperties = {
  padding: ".5rem",
  display: "flex",
  flexDirection: "column",
};

const avatar: CSSProperties = {
  fontSize: "1.2rem",
  margin: "0",
  fontWeight: "bold",
};

const messageBody: CSSProperties = {
  padding: "0.6rem 0.8rem",
  margin: "0",
  backgroundColor: "#dddddd",
  borderRadius: "0.5rem",
  marginLeft: "1rem",
  marginTop: "0.8rem",
};

export default ChatFeed;
