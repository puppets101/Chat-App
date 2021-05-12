import React, {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
  useContext,
  useRef,
  useState,
} from "react";
import { NetworkContext, User } from "../context/NetworkContext";
import {
  buttonStyle,
  flexColStart,
  flexRowCenter,
  flexRowStart,
  inputStyle,
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
    const gif = "/gif";
    const chuckNorris = "/chuck";
    if (message.text.includes(gif)) {
      fetchGifApi();
      return;
    }
    if (message.text.includes(chuckNorris)) {
      fetchInspireApi();
      return;
    }

    network.sendMessage(message.text);
    setMessage({ user: network.currentUser, text: "" });
    network.handleUserIsTyping(false);
    if (messageRef.current) {
      messageRef.current.scrollIntoView(false);
    }
  };

  const fetchGifApi = async () => {
    const api_key = "api_key=RFsRq95ZgqowJeKPEiUUmN6V8Bp8FcSF";
    let searchQuery = message.text.substring(5);
    let url = `https://api.giphy.com/v1/gifs/search?${api_key}&q=${searchQuery}&limit=1&offset=0&rating=g&lang=en`;

    const response = await fetch(url);
    const result = await response.json();

    network.sendMessage(result.data[0].images.downsized.url);
    setMessage({ user: network.currentUser, text: "" });
    network.handleUserIsTyping(false);
  };

  const fetchInspireApi = async () => {
    let url = "https://api.chucknorris.io/jokes/random";

    const response = await fetch(url);
    const result = await response.json();

    network.sendMessage(result.value);
    setMessage({ user: network.currentUser, text: "" });
    network.handleUserIsTyping(false);
  };

  return (
    <div style={root}>
      <div style={{ ...flexColStart, ...messageFeed }}>
        {network.messagesInRoom.map(({ author, body }) => (
          <div ref={messageRef} key={Math.random() * 100} style={messageStyle}>
            <div style={flexRowCenter}>
              <div style={{ ...avatar, ...flexRowCenter }}>
                {author.username[0]}
              </div>
              <p style={nameStyle}>{author.username}</p>
            </div>
            {body.includes("giphy") ? (
              <img
                style={messageBody}
                alt={body}
                src={body}
                width="200px"
              ></img>
            ) : (
              <p style={messageBody}>{body}</p>
            )}
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
          placeholder="Type /gif or /chuck for cool feature"
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
  padding: "1rem",
  top: 0,
  left: 0,
  right: 0,
};

const inputArea: CSSProperties = {
  position: "absolute",
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
  alignItems: "flex-start",
};

const avatar: CSSProperties = {
  marginRight: "0.5rem",
  width: "2.5rem",
  height: "2.5rem",
  borderRadius: "50%",
  backgroundColor: "#4eb5f1",
  fontWeight: "bold",
  color: "white",
  fontSize: "1.5rem",
};

const nameStyle: CSSProperties = {
  fontSize: "1.2rem",
  margin: "0",
  fontWeight: "bold",
};

const messageBody: CSSProperties = {
  padding: "0.6rem 0.8rem",
  margin: "0",
  backgroundColor: "#dddddd",
  borderRadius: "1rem",
  marginLeft: "1rem",
  marginTop: "0.8rem",
};

export default ChatFeed;
