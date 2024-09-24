import NextAuth, { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signinService } from "@/services/authService";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "your-email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { token, isVerified, user } = await signinService(
          credentials?.email!,
          credentials?.password!
        );

        if (!isVerified) {
          throw new Error("Please verify your email.");
        }

        if (token) {
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
};

export const { GET, POST } = NextAuth(authOptions);
