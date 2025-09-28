"use server";

import { Listing, Prisma, User } from "@prisma/client";
import { ActionResult } from "../utils/action-result";
import { prisma } from "../../lib/prisma";
import { isError } from "lodash";

interface CreateUserProps {
  authId: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  pfp: string;
}

export async function createUser({
  email,
  firstName,
  lastName,
  gender,
  age,
  authId,
  pfp,
}: CreateUserProps): ActionResult<User> {
  try {
    const user = await prisma.user.create({
      data: {
        email: email,
        first_name: firstName,
        last_name: lastName,
        gender: gender,
        age: age,
        pfp: pfp,
        auth_id: authId,
      },
    });

    return { isError: false, data: user };
  } catch (e) {
    console.error("Error creating user", e);
    return { isError: true, message: (e as Error).message };
  }
}

type updateUserProps = {
  id: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: string;
};
export async function updateUser({
  id,
  email,
  firstName,
  lastName,
  age,
  gender,
}: updateUserProps): ActionResult<User> {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        email: email,
        first_name: firstName,
        last_name: lastName,
        age: age,
        gender: gender,
      },
    });
    return { isError: false, data: user };
  } catch (e) {
    console.log("Error updating user", e);
    return { isError: true, message: (e as Error).message };
  }
}

// returns users given userID
export async function getUserById(id: number): ActionResult<User> {
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id } }); // 👈 change here

    return { isError: false, data: user };
  } catch (e) {
    console.log("Error getting user", e);
    return { isError: true, message: (e as Error).message };
  }
}

export async function getUserByAuthId(authId: string): ActionResult<User> {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { auth_id: authId },
    }); // 👈 change here

    return { isError: false, data: user };
  } catch (e) {
    console.log("Error getting user", e);
    return { isError: true, message: (e as Error).message };
  }
}

export async function deleteUser(id: number): ActionResult<User> {
  try {
    const user = await prisma.user.delete({ where: { id } });
    return { isError: false, data: user };
  } catch (e) {
    console.log("Error deleting user", e);
    return { isError: true, message: (e as Error).message };
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return { isError: false, data: user ?? null };
  } catch (e) {
    return { isError: true, message: (e as Error).message };
  }
}

export async function saveListing(
  userId: number,
  listingId: number
): ActionResult<boolean> {
  try {
    await prisma.saved.create({
      data: { userId, listingId },
    });
    return { isError: false, data: true };
  } catch (e) {
    console.log("Error when saving listing", e);
    return { isError: true, message: (e as Error).message };
  }
}

export async function unsaveListing(
  userId: number,
  listingId: number
): ActionResult<boolean> {
  try {
    await prisma.saved.delete({
      where: { userId_listingId: { userId, listingId } },
    });
    return { isError: false, data: true };
  } catch (e) {
    console.log("Error when unsaving a listing", e);
    return {
      isError: true,
      message: (e as Error).message ?? "Failed to unsave listing",
    };
  }
}

export async function isSaved({
  userId,
  listingId,
}: {
  userId: number;
  listingId: number;
}) {
  try {
    const save = await prisma.saved.findUnique({
      where: {
        userId_listingId: {
          userId: userId,
          listingId: listingId,
        },
      },
    });

    return { isError: false, data: !!save };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to determine saved";
    return { isError: true, message };
  }
}

export async function toggleSaveListing(
  userId: number,
  listingId: number
): ActionResult<{ saved: boolean }> {
  try {
    await prisma.$transaction(async (tx) => {
      const saved = await tx.saved.findUnique({
        where: {
          userId_listingId: {
            userId: userId,
            listingId: listingId,
          },
        },
      });

      const isSaved = !!saved;

      if (isSaved) {
        await prisma.saved.delete({
          where: { userId_listingId: { userId, listingId } },
        });
      } else {
        await prisma.saved.create({
          data: { userId, listingId },
        });
      }
    });
    return { isError: false, data: { saved: true } };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to toggle save";
    return { isError: true, message };
  }
}

export async function getSavedListingsForUser(
  userId: number
): ActionResult<Listing[]> {
  try {
    const rows = await prisma.saved.findMany({
      where: { userId },
      include: { listing: true },
      orderBy: { createdAt: "desc" },
    });
    return { isError: false, data: rows.map((r) => r.listing) };
  } catch (e: unknown) {
    return {
      isError: true,
      message: (e as Error).message ?? "Failed to load saved listings",
    };
  }
}
