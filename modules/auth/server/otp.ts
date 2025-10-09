import { addMinutes, isAfter } from "date-fns";

import { prisma } from "@/lib/prisma";
import { config } from "@/lib/config";

import { sendOtpEmail } from "./mailer";

const { OTP_CODE_LENGTH, OTP_EXPIRATION_MINUTES, OTP_MAX_ATTEMPTS, OTP_RESEND_WINDOW_SECONDS } =
  config.env;

const prismaClient = prisma;

function generateNumericCode(length: number) {
  const digits = "0123456789";
  const cryptoApi = globalThis.crypto;

  if (cryptoApi?.getRandomValues) {
    const randomValues = new Uint32Array(length);
    cryptoApi.getRandomValues(randomValues);
    return Array.from(randomValues, (value) => digits[value % digits.length]).join("");
  }

  let code = "";
  for (let i = 0; i < length; i += 1) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
}

export async function createOtp(emailRaw: string) {
  const email = emailRaw.toLowerCase();
  const now = new Date();

  const lastOtp = await prismaClient.authOtp.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" },
  });

  if (lastOtp) {
    const allowedResendAt = new Date(lastOtp.createdAt.getTime() + OTP_RESEND_WINDOW_SECONDS * 1000);
    if (now < allowedResendAt) {
      const secondsLeft = Math.ceil((allowedResendAt.getTime() - now.getTime()) / 1000);
      throw new Error(`Debes esperar ${secondsLeft}s antes de solicitar un nuevo código.`);
    }
  }

  const code = generateNumericCode(OTP_CODE_LENGTH);
  const expiresAt = addMinutes(now, OTP_EXPIRATION_MINUTES);

  await prismaClient.authOtp.create({
    data: {
      email,
      code,
      expiresAt,
    },
  });

  await sendOtpEmail({ email, code, expiresAt });

  return { email, expiresAt };
}

export async function verifyOtp(emailRaw: string, codeRaw: string) {
  const email = emailRaw.toLowerCase();
  const code = codeRaw.trim();
  const now = new Date();

  const record = await prismaClient.authOtp.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    throw new Error("No se encontró un código para este correo. Solicítalo nuevamente.");
  }

  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    throw new Error("Has superado el número máximo de intentos. Solicita un nuevo código.");
  }

  if (isAfter(now, record.expiresAt)) {
    await prismaClient.authOtp.delete({ where: { id: record.id } });
    throw new Error("El código ha expirado. Solicita uno nuevo.");
  }

  if (record.code !== code) {
    await prismaClient.authOtp.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    throw new Error("Código inválido. Revisa tu correo e inténtalo de nuevo.");
  }

  await prismaClient.authOtp.delete({ where: { id: record.id } });

  const user = await prismaClient.user.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  return user;
}


