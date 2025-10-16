import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authAdapter } from "./definitions";
import { verifyOtp } from "./otp";

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 días de sesión persistente
    updateAge: 60 * 60 * 24, // Actualizar cada 24 horas
  },
  cookies: {
    sessionToken: {
      name: `deltamanager.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 días persistentes
      },
    },
  },
  pages: {
    signIn: "/access",
    error: "/access",
  },
  providers: [
    Credentials({
      id: "otp",
      name: "otp",
      credentials: {
        email: { label: "Correo", type: "email" },
        userId: { label: "User ID", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const userId = credentials?.userId;

        if (typeof email !== "string" || typeof userId !== "string") {
          console.error("[NextAuth] Missing email or userId");
          return null;
        }

        try {
          // El OTP ya fue validado en /api/auth/verify-otp
          // Aquí solo obtenemos el usuario de la base de datos
          const { prisma } = await import("@/lib/prisma");
          const user = await prisma.user.findUnique({
            where: { id: userId, email },
            select: { id: true, email: true, name: true },
          });

          if (!user) {
            console.error("[NextAuth] User not found");
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("[NextAuth] Authorization failed:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string | null;
      }
      return session;
    },
  },
});

// Export GET and POST handlers for NextAuth routes
export const GET = handlers.GET;
export const POST = handlers.POST;

