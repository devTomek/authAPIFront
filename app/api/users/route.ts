export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(`${process.env.AUTH_API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
