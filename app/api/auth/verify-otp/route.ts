import { NextResponse } from "next/server";
import { verifyOtp } from "@/modules/auth/server/otp";

type VerifyOtpPayload = {
  email: string;
  code: string;
};

export const runtime = "nodejs";
export const preferredRegion = "iad1";

export async function POST(request: Request) {
  try {
    const data = await request.json() as VerifyOtpPayload;
    const email = data?.email;
    const code = data?.code;

    if (!email || !code || typeof email !== "string" || typeof code !== "string" || email.length === 0 || code.length === 0) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const user = await verifyOtp(email, code);
    return NextResponse.json({ success: true, userId: user.id });

  } catch (error) {
    console.error("Error in verify-otp:", error);
    return NextResponse.json({ error: (error as Error).message || "Error interno del servidor" }, { status: 500 });
  }
}


