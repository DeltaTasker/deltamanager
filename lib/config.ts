import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),
  DATABASE_URL: z.string(),
  AUTH_SECRET: z.string().min(32),
  // Phase 2 - Billing (optional for Phase 1)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  // Phase 3 - CFDI (optional for Phase 1)
  FACTURALO_API_KEY: z.string().optional(),
  FACTURALO_API_URL: z.string().url().optional().default("https://dev.facturaloplus.com"),
  FACTURALO_CER_PEM: z.string().optional(), // Certificado SAT en formato PEM
  FACTURALO_KEY_PEM: z.string().optional(), // Llave privada SAT en formato PEM
  // Optional services
  UPSTASH_REDIS_URL: z.string().url().optional(),
  UPSTASH_REDIS_TOKEN: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  // Phase 1 - SMTP (required)
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().default(465),
  SMTP_SECURE: z.coerce.boolean().default(true),
  SMTP_USER: z.string().min(1),
  SMTP_PASSWORD: z.string().min(1),
  SMTP_FROM: z.string().optional(),
  LOCALE: z.string().default("es-MX"),
  // Phase 1 - OTP (required)
  OTP_CODE_LENGTH: z.coerce.number().min(4).max(8).default(6),
  OTP_EXPIRATION_MINUTES: z.coerce.number().min(1).max(30).default(5),
  OTP_MAX_ATTEMPTS: z.coerce.number().min(1).max(10).default(5),
  OTP_RESEND_WINDOW_SECONDS: z.coerce.number().min(15).max(300).default(60),
});

const env = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  FACTURALO_API_KEY: process.env.FACTURALO_API_KEY,
  FACTURALO_API_URL: process.env.FACTURALO_API_URL,
  FACTURALO_CER_PEM: process.env.FACTURALO_CER_PEM,
  FACTURALO_KEY_PEM: process.env.FACTURALO_KEY_PEM,
  UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL,
  UPSTASH_REDIS_TOKEN: process.env.UPSTASH_REDIS_TOKEN,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SECURE: process.env.SMTP_SECURE,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_FROM: process.env.SMTP_FROM,
  LOCALE: process.env.LOCALE,
  OTP_CODE_LENGTH: process.env.OTP_CODE_LENGTH,
  OTP_EXPIRATION_MINUTES: process.env.OTP_EXPIRATION_MINUTES,
  OTP_MAX_ATTEMPTS: process.env.OTP_MAX_ATTEMPTS,
  OTP_RESEND_WINDOW_SECONDS: process.env.OTP_RESEND_WINDOW_SECONDS,
});

if (!env.success) {
  console.error("❌ Invalid environment variables:", env.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const config = {
  env: env.data,
  isProd: env.data.NODE_ENV === "production",
  isDev: env.data.NODE_ENV === "development",
};


