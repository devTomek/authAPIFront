import { z } from "zod";

const createUserSchema = z.object({
  email: z.email(),
  password: z.string().trim().min(1, "Password is required"),
});

export async function POST(request: Request) {
  try {
    const result = createUserSchema.safeParse(await request.json());

    if (!result.success) {
      return Response.json(
        { message: result.error.issues.map((issue) => issue.message) },
        { status: 400 },
      );
    }

    const response = await fetch(`${process.env.AUTH_API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });
    const data = await response.json();

    return Response.json(data, { status: response.status });
  } catch {
    return Response.json(
      { message: "Could not create the user." },
      { status: 500 },
    );
  }
}
