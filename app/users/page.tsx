import { Suspense } from "react";
import UsersList, { type User } from "@/components/UsersList/UsersList";

async function getUsers(): Promise<User[]> {
  const response = await fetch(`${process.env.AUTH_API_URL}/users`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not load users.");
  }

  return response.json();
}

export default function UsersPage() {
  const usersPromise = getUsers();

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold">Users</h1>

        <Suspense fallback={<p>Loading users...</p>}>
          <UsersList usersPromise={usersPromise} />
        </Suspense>
      </div>
    </main>
  );
}
