import { z } from "zod";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3000),
  AWS_SECRET_NAME: z.string().optional(),
});

async function getProductionSecrets(secretName: string) {
  console.log("Fetching secrets from AWS Secrets Manager...");
  const client = new SecretsManagerClient();

  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await client.send(command);

    if (response.SecretString) {
      // Secrets in AWS are stored as a JSON string, so we parse it.
      return JSON.parse(response.SecretString);
    }
    // Handle binary secrets if needed
    // if (response.SecretBinary) { ... }

    throw new Error("SecretString from AWS Secrets Manager was empty.");
  } catch (error) {
    console.error("❌ Failed to fetch secrets from AWS:", error);
    // Exit gracefully if we can't get secrets in production
    process.exit(1);
  }
}

async function loadAndValidateEnv() {
  // In development, load variables from the .env file
  if (process.env.NODE_ENV !== "production") {
    // We use a dynamic import here, so `dotenv` is only imported in dev.
    const { config } = await import("dotenv");
    config();
  }

  let secrets = {};
  // In production, fetch secrets from AWS Secrets Manager
  if (process.env.NODE_ENV === "production") {
    const secretName = process.env.AWS_SECRET_NAME;
    if (!secretName) {
      throw new Error(
        "AWS_SECRET_NAME environment variable not set in production.",
      );
    }
    secrets = await getProductionSecrets(secretName);
  }

  // Merge process.env with secrets from AWS (secrets take precedence)
  const allVars = { ...process.env, ...secrets };

  // Validate all variables against the Zod schema
  return envSchema.parse(allVars);
}

// Use top-level await. The rest of your app will not execute until this promise resolves.
export const env = await loadAndValidateEnv();
