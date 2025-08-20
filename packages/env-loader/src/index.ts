import { cleanEnv, str, port, url } from "envalid";

type Envs = {
  NODE_ENV: string;
  PORT: number;
  DB_URL: string;
};

export const envs: Envs = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development", "production"] }),
  PORT: port({ default: 3000 }),
  DB_URL: url({ default: "none" }),
});
