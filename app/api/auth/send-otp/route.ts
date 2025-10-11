import { NextResponse } from "next/server";
import { createOtp } from "@/modules/auth/server/otp";

type SendOtpPayload = {
  email: string;
};

export const runtime = "nodejs";
export const preferredRegion = "iad1";

export async function POST(request: Request) {
  try {
    const data = await request.json() as SendOtpPayload;
    const email = data?.email;

    if (!email || typeof email !== "string" || email.length === 0) {
      return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
    }

    const result = await createOtp(email);
    return NextResponse.json({ success: true, expiresAt: result.expiresAt.toISOString() });

  } catch (error) {
    console.error("Error in send-otp:", error);
    return NextResponse.json({ error: (error as Error).message || "Error interno del servidor" }, { status: 500 });
  }
}


