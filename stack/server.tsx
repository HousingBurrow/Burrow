import "server-only";

import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  // ✨ Add the urls configuration block
  urls: {
    // This is the path the user will be redirected to after a successful sign-up
    afterSignUp: "/onboarding-info", 
  },
});