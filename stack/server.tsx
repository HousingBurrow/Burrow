import "server-only";

import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signUp: "/auth/sign-up",
    signIn: "/auth/sign-in",
    afterSignUp: "/auth/sign-up/account-information",
    afterSignIn: "/",
    oauthCallback: "/handler/oauth-callback",
    handler: "/handler",
    home: "/",
  },
});
