import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "",
  plugins: [emailOTPClient()],
});

export const { signIn, signOut, useSession, emailOtp } = authClient;
