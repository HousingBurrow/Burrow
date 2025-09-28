"use client";

import { SignUp, useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const user = useUser();
  const router = useRouter();

  return <SignUp fullPage />;
}
