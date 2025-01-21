import { Box, Text } from "@chakra-ui/react";

import { Tooltip } from "@/components/ui/tooltip";
import { FaCircleInfo } from "react-icons/fa6";

export const Demo: React.FC = () => {
  return (
    <Box
      top={2}
      display="flex"
      justifyContent="center"
      alignItems="center"
      width={"100%"}
      marginTop={2}
    >
      <Tooltip
        content="We use the AWS Lex service for interaction with the bot. This UI demo version is not part of the system."
        openDelay={500}
        closeDelay={100}
      >
        <Box display="flex" flexDirection="row" alignItems="center">
          <Text
            textAlign="center"
            color="gray.400"
            fontSize="xs"
            marginRight={1}
          >
            This is a demo version
          </Text>
          <FaCircleInfo color="gray" size={12} />
        </Box>
      </Tooltip>
    </Box>
  );
};
