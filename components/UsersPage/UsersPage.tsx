import { Suspense } from "react";
import UsersList, { type User } from "@/components/UsersList/UsersList";

type UsersPageProps = {
  title: string;
  usersPromise: Promise<User[]>;
};

export default function UsersPage({ title, usersPromise }: UsersPageProps) {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold">{title}</h1>

        <Suspense fallback={<p>Loading users...</p>}>
          <UsersList usersPromise={usersPromise} />
        </Suspense>
      </div>
    </main>
  );
}
