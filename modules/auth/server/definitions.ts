import { type Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authAdapter: Adapter = PrismaAdapter(prisma);

export const authRoles = ["admin", "accountant", "viewer"] as const;

export type AuthRole = (typeof authRoles)[number];


