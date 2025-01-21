import { useState } from "react";
import {
  LexRuntimeV2Client,
  RecognizeTextCommand,
} from "@aws-sdk/client-lex-runtime-v2";

import { IChatMessage, ISenderType } from "../interfaces/chat";
import { IRoleData } from "../interfaces/aws";

export const useChatMessages = (role: IRoleData | null) => {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim() || !role) return;

    const userMessage: IChatMessage = { sender: ISenderType.USER, text: input };
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

      const botMessage: IChatMessage = {
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

  return {
    messages,
    input,
    setInput,
    handleSend,
  };
};
