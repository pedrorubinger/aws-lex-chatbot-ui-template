export interface IRoleData {
  AccessKeyId?: string;
  SecretAccessKey?: string;
  SessionToken?: string;
  Expiration?: Date;
}

export interface IAssumeRoleParams {
  accessKey: string;
  secretKey: string;
  roleArn: string;
  sessionName: string;
}
