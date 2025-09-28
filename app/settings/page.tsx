import { prisma } from "@/lib/prisma";
import ClientSettings from "./ClientSettings";
import { stackServerApp } from "./stack";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  // Get the authenticated user from Stack Auth
  const user = await stackServerApp.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/handler/sign-in");
  }

  // Get the user's Stack Auth ID
  const stackUserId = user.id;
  const userEmail = user.primaryEmail?.toLowerCase().trim();

  console.log("Stack Auth user:", { stackUserId, userEmail });

  // Find or create the user in your database using their Stack Auth ID
  // First try to find by stack_auth_id (if that field exists)
  let dbUser = await prisma.user.findFirst({
    where: {
      OR: [{ auth_id: stackUserId }, { email: userEmail || "" }],
    },
  });

  console.log("User lookup result:", { found: !!dbUser, userId: dbUser?.id });

  // If user doesn't exist, create them with required fields
  if (!dbUser) {
    // Extract name from Stack Auth or use defaults
    const displayName = user.displayName || "";
    const nameParts = displayName.split(" ");
    const firstName = nameParts[0] || "User";
    const lastName = nameParts.slice(1).join(" ") || "Name";

    dbUser = await prisma.user.create({
      data: {
        auth_id: stackUserId,
        email: user.primaryEmail || "",
        first_name: firstName,
        last_name: lastName,
        age: 0, // Default age - user can update in settings
        gender: "Prefer not to say", // Default gender - user can update in settings
        pfp: "",
      },
    });
  } else if (!dbUser.auth_id) {
    // Update existing user with stack_auth_id if it's missing
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
    notifications: true,
    darkMode: false,
    defaultLocation: "Midtown" as const,
  };

  return <ClientSettings userId={dbUser.id} initial={initial} />;
}
