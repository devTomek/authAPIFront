import { Suspense } from "react";
import HomeButton from "@/components/HomeButton/HomeButton";
import LogoutButton from "@/components/LogoutButton/LogoutButton";
import UsersList, { type User } from "@/components/UsersList/UsersList";

interface UsersPageProps {
  title: string;
  route: "/users" | "/auth/users";
  canManageUsers: boolean;
  usersPromise: Promise<User[]>;
}

export default function UsersPage({
  title,
  route,
  canManageUsers,
  usersPromise,
}: UsersPageProps) {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">
              You are viewing{" "}
              <code className="rounded bg-slate-200 px-1.5 py-0.5 text-slate-700">
                {route}
              </code>
            </p>
          </div>
          {canManageUsers ? <LogoutButton /> : <HomeButton />}
        </div>

        <Suspense fallback={<p>Loading users...</p>}>
          <UsersList
            usersPromise={usersPromise}
            canManageUsers={canManageUsers}
          />
        </Suspense>
      </div>
    </main>
  );
}
