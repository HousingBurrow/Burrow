import { StackClientApp } from "@stackframe/stack";

export const stackClientApp = new StackClientApp({
  tokenStore: "nextjs-cookie",
  urls: {
    home: "/",
    afterSignIn: "/",
    afterSignUp: "/auth/sign-up/account-information",
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
  },
  },
);
