import { cookies } from "next/headers";
import { z } from "zod";

const updateUserSchema = z.object({
  email: z.email(),
  password: z.string().trim().min(1, "Password is required"),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const result = updateUserSchema.safeParse(await request.json());

    if (!result.success) {
      return Response.json(
        { message: result.error.issues.map((issue) => issue.message) },
        { status: 400 },
      );
    }

    const { id } = await params;
    const token = (await cookies()).get("access_token")?.value;
    const response = await fetch(`${process.env.AUTH_API_URL}/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(result.data),
    });
    const data = await response.json();

    return Response.json(data, { status: response.status });
  } catch {
    return Response.json(
      { message: "Could not update the user." },
      { status: 500 },
    );
  }
}
