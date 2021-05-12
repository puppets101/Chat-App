import React, {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
  useContext,
  useState,
} from "react";
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

  const handleUserIsTyping = (e: KeyboardEvent<HTMLInputElement>) => {
    network.handleUserIsTyping(true);
    if (message.text === "" || e.key === "ENTER") {
      network.handleUserIsTyping(false);
    }
    if (e.key === "ENTER") {
      handleSendMessage();
    }
  };

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
      <div style={messageFeed}>
        {network.messagesInRoom.map(({ author, body }) => (
          <div key={Math.random() * 100} style={messageStyle}>
            <p style={avatar}>{author.username}</p>
            {body.includes("giphy") ? (
              <img src={body} width="200px"></img>
            ) : (
              <p style={textMessage}>{body}</p>
            )}
          </div>
        ))}
        {network.whoIsTyping ? <span>{network.whoIsTyping}</span> : null}
      </div>
      <div style={inputArea}>
        <label style={label} htmlFor="username">
          Message
        </label>
        <input
          style={inputStyle}
          type="text"
          name="message"
          placeholder="Type /gif or /chuck"
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
