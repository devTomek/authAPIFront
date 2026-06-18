import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type User } from "@/components/UsersList/UsersList";
import UsersPage from "@/components/UsersPage/UsersPage";

async function getProtectedUsers(token: string): Promise<User[]> {
  const response = await fetch(`${process.env.AUTH_API_URL}/auth/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not load protected users.");
  }

  return response.json();
}

export default async function ProtectedUsersPage() {
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const usersPromise = getProtectedUsers(token);

  return <UsersPage title="Protected users" usersPromise={usersPromise} />;
}
