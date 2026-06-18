import { NextResponse } from "next/server";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().trim().min(1, "Password is required"),
});

export async function POST(request: Request) {
  try {
    const result = loginSchema.safeParse(await request.json());

    if (!result.success) {
      return Response.json(
        { message: result.error.issues.map((issue) => issue.message) },
        { status: 400 },
      );
    }

    const response = await fetch(`${process.env.AUTH_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });
    const data = await response.json();
    const nextResponse = NextResponse.json(data, { status: response.status });

    if (response.ok && data.accessToken) {
      nextResponse.cookies.set("access_token", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    return nextResponse;
  } catch {
    return Response.json({ message: "Could not log in." }, { status: 500 });
  }
}
