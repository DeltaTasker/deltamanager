import { NextResponse } from "next/server";

import { switchCompanyAction } from "@/modules/companies/actions/switch-company";

export async function POST(request: Request) {
  const payload = (await request.json()) as { companyId?: unknown };
  const companyId = payload?.companyId;

  if (typeof companyId !== "string") {
    return NextResponse.json({ error: "Invalid company id" }, { status: 400 });
  }

  try {
    await switchCompanyAction(companyId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

