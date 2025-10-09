import { NextResponse } from "next/server";

import { verifyOtp } from "@/modules/auth/server/otp";

type VerifyOtpPayload = {
  email: string;
  code: string;
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  const data = (await request.json().catch(() => null)) as VerifyOtpPayload | null;

  const email = data?.email;
  const code = data?.code;

  if (typeof email !== "string" || typeof code !== "string" || email.length === 0 || code.length === 0) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  try {
    const user = await verifyOtp(email, code);
    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}


