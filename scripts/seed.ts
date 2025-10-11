import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL ?? "file:./dev.db",
};

try {
  execSync("pnpm tsx modules/auth/server/seed.ts", {
    stdio: "inherit",
    cwd: path.join(__dirname, ".."),
    env,
  });
} catch (error) {
  console.error("Seed failed", error);
  process.exit(1);
}

