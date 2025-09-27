// app/api/users/create/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface CreateUserBody {
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
}

export async function POST(request: Request) {
  try {
    const body: CreateUserBody = await request.json();

    // Basic validation
    if (!body.email || !body.firstName || !body.lastName || !body.gender || body.age === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        email: body.email,
        first_name: body.firstName,
        last_name: body.lastName,
        gender: body.gender,
        age: body.age,
      },
    });

    return NextResponse.json({ isError: false, data: user }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { isError: true, message: (error as Error).message },
      { status: 500 }
    );
  }
}
