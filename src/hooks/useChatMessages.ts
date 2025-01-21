import { useState } from "react";
import { v4 } from "uuid";
import {
  LexRuntimeV2Client,
  RecognizeTextCommand,
} from "@aws-sdk/client-lex-runtime-v2";

import { IChatMessage, ISenderType } from "../interfaces/chat";
import { IRoleData } from "../interfaces/aws";

const errorMessage = "Sorry, I didn't understand. Could you please try again?";

export const useChatMessages = (role: IRoleData | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim() || !role) return;

    setInput("");
    setIsLoading(true);

    const userMessage: IChatMessage = {
      id: v4(),
      sender: ISenderType.USER,
      text: input,
      timestamp: new Date(),
    };
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
        id: v4(),
        sender: ISenderType.BOT,
        text: response.messages?.[0]?.content || errorMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("[AWS] Error - Amazon Lex:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: v4(),
          text: errorMessage,
          sender: ISenderType.BOT,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    messages,
    input,
    setInput,
    handleSend,
  };
};
