import { NextResponse } from "next/server";

import { createOtp } from "@/modules/auth/server/otp";

type SendOtpPayload = {
  email: string;
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  const data = (await request.json().catch(() => null)) as SendOtpPayload | null;

  const email = data?.email;
  if (typeof email !== "string" || email.length === 0) {
    return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
  }

  try {
    const result = await createOtp(email);
    return NextResponse.json({ success: true, expiresAt: result.expiresAt.toISOString() });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}


