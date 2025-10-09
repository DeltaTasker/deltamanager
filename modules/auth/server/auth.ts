import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authAdapter } from "./definitions";
import { verifyOtp } from "./otp";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: authAdapter,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
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
        code: { label: "Código", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const code = credentials?.code;

        if (typeof email !== "string" || typeof code !== "string") {
          return null;
        }

        return verifyOtp(email, code);
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token?.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
});

