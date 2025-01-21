import { useEffect } from "react";
import { Box, Button, Container, Input, Text } from "@chakra-ui/react";

import { useAwsRole } from "../hooks/useAwsRole";
import { useChatMessages } from "../hooks/useChatMessages";
import { ISenderType } from "@/interfaces/chat";

interface IProps {}

export const Chat: React.FC<IProps> = () => {
  const { role, setUp } = useAwsRole();
  const { messages, input, isLoading, setInput, handleSend } =
    useChatMessages(role);

  const lastSender = messages?.[messages.length - 1]?.sender;

  useEffect(() => {
    setUp();
  }, [setUp]);

  return (
    <Container
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <img src={"src/assets/logo.png"} width={120} height={20} />
      <Box
        borderRadius={6}
        backgroundColor="#EDF0FA"
        marginTop={5}
        width={500}
        height={500}
        overflowY="scroll"
        display="flex"
        flexDirection="column"
        gap={2}
        padding={3}
      >
        {!messages.length && (
          <Text color="blue.800" textAlign="center">
            Send a message to start using the ChatBot.
          </Text>
        )}
        {messages.map((msg, index) => {
          const isBotSender = msg.sender === "bot";

          return (
            <Box
              key={index}
              display="flex"
              flexDirection="column"
              justifyContent={isBotSender ? "flex-start" : "flex-end"}
            >
              <Box
                maxWidth="70%"
                alignSelf={isBotSender ? "flex-start" : "flex-end"}
                textAlign={isBotSender ? "left" : "right"}
                margin="5px 0px"
                padding={2}
                paddingLeft={4}
                paddingRight={4}
                borderRadius={4}
                backgroundColor={isBotSender ? "white" : "blue.800"}
              >
                <Text color={isBotSender ? "gray.700" : "white"}>
                  {msg.text}
                </Text>
              </Box>
              <Text
                fontSize="x-small"
                color="blue.800"
                textAlign={isBotSender ? "left" : "right"}
              >
                {msg.timestamp &&
                  new Intl.DateTimeFormat("en-US", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(msg.timestamp)}
              </Text>
            </Box>
          );
        })}
        {!!isLoading && (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            alignItems="flex-start"
          >
            <Box
              maxWidth="70%"
              margin="5px 0px"
              backgroundColor={
                lastSender === ISenderType.BOT ? "blue.800" : "white"
              }
              padding={2}
              paddingLeft={4}
              paddingRight={4}
              borderRadius={4}
              alignSelf={
                lastSender === ISenderType.BOT ? "flex-end" : "flex-start"
              }
              textAlign={lastSender === ISenderType.BOT ? "left" : "right"}
            >
              <Text
                color={lastSender === ISenderType.BOT ? "white" : "blue.800"}
              >
                ...
              </Text>
            </Box>
          </Box>
        )}
      </Box>

      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        marginTop={5}
        gap={3}
      >
        <Input
          type="text"
          variant="subtle"
          placeholder="Type a message..."
          onChange={(e) => setInput(e.target.value)}
          value={input}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          disabled={isLoading}
        />
        <Button
          variant="plain"
          onClick={handleSend}
          disabled={!input || isLoading}
        >
          Send
        </Button>
      </Box>
    </Container>
  );
};
