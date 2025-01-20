// env.d.ts

interface ImportMetaEnv {
  readonly VITE_BOT_ID: string;
  readonly VITE_BOT_ALIAS_ID: string;
  readonly VITE_BOT_LOCALE_ID: string;
  readonly VITE_BOT_SESSION_ID: string;
  readonly VITE_AWS_ROLE_ACCESS_KEY: string;
  readonly VITE_AWS_ROLE_ARN: string;
  readonly VITE_AWS_ROLE_SECRET_KEY: string;
  readonly VITE_AWS_ROLE_SESSION_NAME: string;
  readonly VITE_AWS_REGION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
