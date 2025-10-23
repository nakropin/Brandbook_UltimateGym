import NextAuth, { AuthOptions, Account, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar.readonly",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: JWT; account: Account | null }) {
      // Beim initialen Login
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt =
          Math.floor(Date.now() / 1000) +
          ((account.expires_in as number) || 3600);
        return token;
      }

      // Prüfe ob Token noch gültig ist
      if (Date.now() < (token.expiresAt as number) * 1000) {
        return token;
      }

      // Token ist abgelaufen - Refresh Token verwenden
      console.log("Token abgelaufen, refreshe...");
      try {
        const response = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            grant_type: "refresh_token",
            refresh_token: (token.refreshToken as string) || "",
          }).toString(),
        });

        if (!response.ok) {
          console.error("Token refresh fehlgeschlagen:", response.status);
          throw new Error("Token refresh failed");
        }

        const newTokens = await response.json();

        return {
          ...token,
          accessToken: newTokens.access_token,
          refreshToken: newTokens.refresh_token ?? token.refreshToken,
          expiresAt: Math.floor(Date.now() / 1000) + newTokens.expires_in,
        };
      } catch (error) {
        console.error("Fehler beim Refresh Token:", error);
        return token;
      }
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
