import { useState, useCallback } from "react";

import { IRoleData } from "../interfaces/aws";
import { assumeRole } from "../services/aws/credentials";

export const useAwsRole = () => {
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

  return { role, setUp };
};
