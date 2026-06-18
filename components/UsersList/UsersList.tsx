"use client";

import { use } from "react";

export type User = {
  id: number;
  email: string;
};

type UsersListProps = {
  usersPromise: Promise<User[]>;
};

export default function UsersList({ usersPromise }: UsersListProps) {
  const users = use(usersPromise);

  if (users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <ul className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {users.map((user) => (
        <li
          className="border-b border-slate-200 p-4 last:border-b-0"
          key={user.id}
        >
          {user.email}
        </li>
      ))}
    </ul>
  );
}
