import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";

import { IAssumeRoleParams } from "../../interfaces/aws";

export const assumeRole = async ({
  accessKey,
  secretKey,
  roleArn,
  sessionName,
}: IAssumeRoleParams) => {
  try {
    const stsClient = new STSClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });

    const command = new AssumeRoleCommand({
      RoleArn: roleArn,
      RoleSessionName: sessionName,
    });

    const response = await stsClient.send(command);

    if (response.Credentials) {
      console.log("[AWS] Successfully assumed role!");

      return {
        AccessKeyId: response.Credentials.AccessKeyId,
        SecretAccessKey: response.Credentials.SecretAccessKey,
        SessionToken: response.Credentials.SessionToken,
        Expiration: response.Credentials.Expiration,
      };
    } else {
      console.error("[AWS] Failed to retrieve credentials.");
      return null;
    }
  } catch (error) {
    console.error("[AWS] Error assuming role:", error);
    return null;
  }
};
