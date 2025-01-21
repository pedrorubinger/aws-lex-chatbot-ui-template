import { useEffect } from "react";
import { useAwsRole } from "./hooks/useAwsRole";
import { useChatMessages } from "./hooks/useChatMessages";
import "./App.css";

export const App: React.FC = () => {
  const { role, setUp } = useAwsRole();
  const { messages, input, setInput, handleSend } = useChatMessages(role);

  useEffect(() => {
    setUp();
  }, [setUp]);

  return (
    <div style={{ width: "500px", margin: "0 auto" }}>
      <img src={"src/assets/logo.png"} width={120} height={20} />
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "400px",
          overflowY: "scroll",
          marginBottom: "10px",
          marginTop: "15px",
          background: "#fff",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === "bot" ? "left" : "right",
              margin: "5px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "5px 10px",
                borderRadius: "10px",
                background: msg.sender === "bot" ? "#f0f0f0" : "#007bff",
                color: msg.sender === "bot" ? "#000" : "red",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        style={{ width: "calc(100% - 60px)", marginRight: "10px" }}
      />
      <button
        onClick={handleSend}
        style={{ padding: "10px 20px", marginTop: 10 }}
        disabled={!input}
      >
        Send
      </button>
    </div>
  );
};

export default App;
