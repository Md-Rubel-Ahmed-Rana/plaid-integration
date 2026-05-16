import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const cors_origins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const envConfig = {
  app: {
    port: process.env.PORT ? Number(process.env.PORT) : 5000,
    env: process.env.NODE_ENV as "development" | "production",
    name: process.env.APP_NAME || "Express Modular App",
    encryption_key: process.env.ENCRYPTION_KEY as string,
  },

  cors_origins: cors_origins,
  database: {
    mongodb_url: process.env.MONGODB_URL as string,
  },
  jwt: {
    access_token_expires: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
    refresh_token_expires: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
    secret: process.env.JWT_TOKEN_SECRET as string,
    access_cookie_name:
      process.env.ACCESS_TOKEN_COOKIE_NAME || "myapp_auth_access_token",
    refresh_cookie_name:
      process.env.REFRESH_TOKEN_COOKIE_NAME || "myapp_auth_refresh_token",
  },
  plaid: {
    client_id: process.env.PLAID_CLIENT_ID as string,
    secret: process.env.PLAID_SECRET as string,
  },
};
