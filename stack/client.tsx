import { StackClientApp } from "@stackframe/stack";

export const stackClientApp = new StackClientApp({
  tokenStore: "nextjs-cookie",
  urls: {
    home: "/",
    signUp: "/auth/sign-up",
    signIn: "/auth/sign-in",
    afterSignUp: "/auth/sign-up/account-information",
    afterSignIn: "/",
    oauthCallback: "/handler/oauth-callback",
    handler: "/handler",
  },
});
