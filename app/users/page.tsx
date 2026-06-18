import { type User } from "@/components/UsersList/UsersList";
import UsersPage from "@/components/UsersPage/UsersPage";

async function getUsers(): Promise<User[]> {
  const response = await fetch(`${process.env.AUTH_API_URL}/users`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not load users.");
  }

  return response.json();
}

export default function PublicUsersPage() {
  const usersPromise = getUsers();

  return (
    <UsersPage
      title="Public users"
      route="/users"
      canManageUsers={false}
      usersPromise={usersPromise}
    />
  );
}
