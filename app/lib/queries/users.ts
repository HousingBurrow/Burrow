'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { User } from '@/generated/prisma';
import { ActionResult } from '../utils/action-result';
import { number } from 'framer-motion';
import { prisma } from '../../lib/prisma';

interface CreateUserProps {
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
}

export async function createUser({ email, firstName, lastName, gender, age }: CreateUserProps): ActionResult<User> {
  try {
    const user = await prisma.user.create({
      data: { 
        email,
        firstName,
        lastName,
        gender,
        age,
      }
    });

    return { isError: false, data: user }
  } catch (e) {
    console.error("Error creating user", e);
    return { isError: true, message: (e as Error).message}; 
  }
}


export async function updateUser(
  id: number,
  email?: string,          // used as a WHERE filter if provided
  firstName?: string,
  lastName?: string,
  gender?: string,
  age?: number
) {
  // Build data object (map camelCase -> DB fields) and strip undefineds
  const data = Object.fromEntries(
    Object.entries({
      first_name: firstName,
      last_name:  lastName,
      gender,
      age,
    }).filter(([, v]) => v !== undefined)
  );

  if (Object.keys(data).length === 0) {
    throw new Error('No fields to update');
  }

  // Prefer updating by email if provided; else use id
  if (email) {
    const result = await prisma.user.updateMany({
      where: { email },
      data,
    });
    return result.count; // number of rows updated (0 or 1 typically)
  } else {
    await prisma.user.update({
      where: { id },
      data,
    });
    return 1;
  }
}



// returns users given userID
export async function getUserById(id: number): ActionResult<User> {
  try {
    const user = await prisma.user.findUnique({ where: { id}});
    return { isError: false, data: user};
  } catch (e) {
    console.log("Error getting user", e);
    return {isError: true, message: (e as Error).message };
  }
}

export async function deleteUser(id: number): ActionResult<User> {
  try {
    const user = await prisma.user.delete({ where: { id }});
    return { isError: false, data: user}
  } catch (e) {
    console.log("Error deleting user", e);
    return {isError: true, message: (e as Error).message };
  }
}


