import crypto from "crypto";
import { envConfig } from "../config";

class Crypto {
  private ALGORITHM = "aes-256-cbc";
  private ENCRYPTION_KEY = envConfig.app.encryption_key;
  private IV_LENGTH = 16;
  encrypt(text: string): string {
    console.log({ encryption_key: this.ENCRYPTION_KEY });
    if (this.ENCRYPTION_KEY.length !== 32) {
      throw new Error(
        "ENCRYPTION_KEY must be exactly 32 bytes for aes-256-cbc"
      );
    }
    const iv = crypto.randomBytes(this.IV_LENGTH);

    const cipher = crypto.createCipheriv(
      this.ALGORITHM,
      Buffer.from(this.ENCRYPTION_KEY),
      iv
    );

    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
  }

  decrypt(encryptedText: string): string {
    const [ivHex, encryptedHex] = encryptedText.split(":");

    const iv = Buffer.from(ivHex, "hex");

    const encrypted = Buffer.from(encryptedHex, "hex");

    const decipher = crypto.createDecipheriv(
      this.ALGORITHM,
      Buffer.from(this.ENCRYPTION_KEY),
      iv
    );

    let decrypted = decipher.update(encrypted);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }
}

export const CryptoInstance = new Crypto();
