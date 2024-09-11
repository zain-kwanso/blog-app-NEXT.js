import { NextResponse } from "next/server";
import User from "../../../database/models/user.model";

// Handle GET requests to fetch users
export async function GET() {
  try {
    const users = await User.findAll();

    return NextResponse.json(users);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// Handle POST requests to create a new user
export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const newUser = await User.create({
      name,
      email,
      password, // Ideally hash the password before saving
    });

    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
