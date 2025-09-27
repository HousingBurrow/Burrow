import "server-only";

import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    home: "/",
    afterSignIn: "/",
    afterSignUp: "/auth/sign-up/account-information",
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
  },
});
