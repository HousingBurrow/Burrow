'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '../lib/prisma';


export async function createUser(formData: FormData) {
  const email = String(formData.get('email') || '');
  const first_name = String(formData.get('first_name') || '');
  const last_name = String(formData.get('last_name') || '');
  const gender = String(formData.get('gender') || '');
  const age = Number(formData.get('age') || 0);

  if (!email || !first_name || !last_name || !gender || !age) {
    throw new Error('All fields are required');
  }

  try {
    const user = await prisma.user.create({
      data: { email, first_name, last_name, gender, age }
    });
    revalidatePath('/users');
    redirect(`/users/${user.id}`);
  } catch (e: any) {
    if (e?.code === 'P2002') throw new Error('Email already exists');
    throw e;
  }
}

export async function updateUser(userId: number, formData: FormData) {
  const patch: any = {};
  for (const key of ['first_name','last_name','gender','age']) {
    const v = formData.get(key);
    if (v !== null && v !== '') patch[key] = key === 'age' ? Number(v) : String(v);
  }
  const user = await prisma.user.update({ where: { id: userId }, data: patch });
  revalidatePath(`/users/${userId}`);
  return user;
}

export async function deleteUser(userId: number) {
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath('/users');
  redirect('/users');
}
