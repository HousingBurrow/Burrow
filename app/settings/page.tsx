// app/profile/settings/page.tsx
import { prisma } from "@/lib/prisma";
import ClientSettings from "./ClientSettings";
import { stackServerApp } from "./stack";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await stackServerApp.getUser();
  if (!user) redirect("/handler/sign-in");

  const stackUserId = user.id;
  const userEmail = user.primaryEmail?.toLowerCase().trim();

  let dbUser = await prisma.user.findFirst({
    where: { OR: [{ auth_id: stackUserId }, { email: userEmail || "" }] },
  });

  if (!dbUser) {
    const displayName = user.displayName || "";
    const parts = displayName.split(" ");
    const first = parts[0] || "User";
    const last = parts.slice(1).join(" ") || "Name";

    dbUser = await prisma.user.create({
      data: {
        auth_id: stackUserId,
        email: user.primaryEmail || "",
        first_name: first,
        last_name: last,
        age: 0,
        gender: "Prefer not to say",
        pfp: "",
      },
    });
  } else if (!dbUser.auth_id) {
    dbUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: { auth_id: stackUserId },
    });
  }

  const initial = {
    firstName: dbUser.first_name || "",
    lastName: dbUser.last_name || "",
    email: dbUser.email || user.primaryEmail || "",
    age: dbUser.age || 0,
    gender:
      (dbUser.gender as "Male" | "Female" | "Other" | "Prefer not to say") ||
      "Prefer not to say",
    pfp: dbUser.pfp || "",            // 👈 add this
    notifications: true,
    darkMode: false,
    defaultLocation: "Midtown" as const,
  };

  return <ClientSettings userId={dbUser.id} initial={initial} />;
}
