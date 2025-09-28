"use server";

import { User } from "@prisma/client";
import { ActionResult } from "../utils/action-result";
import { prisma } from "../../lib/prisma";

interface CreateUserProps {
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
}

export async function createUser({
  email,
  firstName,
  lastName,
  gender,
  age,
}: CreateUserProps): ActionResult<User> {
  try {
    const user = await prisma.user.create({
      data: {
        email: email,
        first_name: firstName,
        last_name: lastName,
        gender: gender,
        age: age,
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
}
export async function updateUser({ id, email, firstName, lastName, age, gender }: updateUserProps): ActionResult<User> {
  try {
    const user = await prisma.user.update({ where: { id }, data: {
      email: email,
      first_name: firstName,
      last_name: lastName,
      age: age,
      gender: gender,
    }});
    return {isError: false, data: user};
  } catch (e) {
    console.log("Error updating user", e);
    return {isError: true, message: (e as Error).message};
  }
} 

// returns users given userID
export async function getUserById(id: number): ActionResult<User> {
  try {
    const user = await prisma.user.findUnique({ where: { id } }) // 👈 change here
    if (!user) {
      return { isError: true, message: `No user found with id ${id}` }
    }
    return { isError: false, data: user }
  } catch (e) {
    console.log("Error getting user", e)
    return { isError: true, message: (e as Error).message }
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