import { useCallback, useEffect, useState } from "react";
import {
  LexRuntimeV2Client,
  RecognizeTextCommand,
} from "@aws-sdk/client-lex-runtime-v2";

import "./App.css";
import { IChatMessage, ISenderType } from "./interfaces/chat";
import { IRoleData } from "./interfaces/aws";
import { assumeRole } from "./services/aws/credentials";

export const App: React.FC = () => {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [role, setRole] = useState<IRoleData | null>(null);

  const setUp = useCallback(async () => {
    const data = await assumeRole({
      accessKey: import.meta.env.VITE_AWS_ROLE_ACCESS_KEY,
      roleArn: import.meta.env.VITE_AWS_ROLE_ARN,
      secretKey: import.meta.env.VITE_AWS_ROLE_SECRET_KEY,
      sessionName: import.meta.env.VITE_AWS_ROLE_SESSION_NAME,
    });

    if (data) setRole(data);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !role) return;

    const userMessage = { sender: ISenderType.USER, text: input };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const lexClient = new LexRuntimeV2Client({
        region: import.meta.env.VITE_AWS_REGION,
        credentials: {
          accessKeyId: role.AccessKeyId as string,
          secretAccessKey: role.SecretAccessKey as string,
          sessionToken: role.SessionToken as string,
          expiration: role.Expiration as Date,
        },
      });

      const command = new RecognizeTextCommand({
        botId: import.meta.env.VITE_BOT_ID,
        botAliasId: import.meta.env.VITE_BOT_ALIAS_ID,
        localeId: import.meta.env.VITE_BOT_LOCALE_ID,
        sessionId: import.meta.env.VITE_BOT_SESSION_ID,
        text: input,
      });

      const response = await lexClient.send(command);

      const botMessage = {
        sender: ISenderType.BOT,
        text:
          response.messages?.[0]?.content ||
          "Error communicating with the bot.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("[AWS] Error - Amazon Lex:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: ISenderType.BOT,
          text: "Sorry. Error communicating with the bot.",
        },
      ]);
    }

    setInput("");
  };

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
