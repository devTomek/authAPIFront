"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "@/components/Button/Button";

export type User = {
  id: number;
  email: string;
};

interface UsersListProps {
  usersPromise: Promise<User[]>;
}

const updateUserSchema = z.object({
  email: z.email(),
  password: z.string().trim().min(1, "Password is required"),
});

type UpdateUserData = z.infer<typeof updateUserSchema>;

export default function UsersList({ usersPromise }: UsersListProps) {
  const initialUsers = use(usersPromise);
  const [users, setUsers] = useState(initialUsers);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<{
    userId: number;
    message: string;
  } | null>(null);
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
  });

  function startEditing(user: User) {
    setEditingUserId(user.id);
    setMessage("");
    reset({ email: user.email, password: "" });
  }

  function cancelEditing() {
    setEditingUserId(null);
    setMessage("");
    reset();
  }

  async function updateUser(formData: UpdateUserData) {
    if (editingUserId === null) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch(`/api/users/${editingUserId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        const errorMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.error || data.message || "Could not update the user.";

        setMessage(errorMessage);
        return;
      }

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === editingUserId
            ? { ...user, email: data.email ?? formData.email }
            : user,
        ),
      );
      cancelEditing();
    } catch {
      setMessage("Could not update the user.");
    }
  }

  async function deleteUser(user: User) {
    const confirmed = window.confirm(`Delete ${user.email}?`);

    if (!confirmed) {
      return;
    }

    setDeletingUserId(user.id);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.error || data.message || "Could not delete the user.";

        setDeleteError({ userId: user.id, message: errorMessage });
        return;
      }

      setUsers((currentUsers) =>
        currentUsers.filter((currentUser) => currentUser.id !== user.id),
      );
    } catch {
      setDeleteError({
        userId: user.id,
        message: "Could not delete the user.",
      });
    } finally {
      setDeletingUserId(null);
    }
  }

  if (users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <ul className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {users.map((user) => (
        <li
          className="group border-b border-slate-200 p-4 last:border-b-0"
          key={user.id}
        >
          {editingUserId === user.id ? (
            <form
              className="grid gap-3"
              onSubmit={handleSubmit(updateUser)}
              noValidate
            >
              <input
                className="rounded-lg border border-slate-300 p-2"
                type="email"
                aria-label="Email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-700">{errors.email.message}</p>
              )}

              <input
                className="rounded-lg border border-slate-300 p-2"
                type="password"
                placeholder="New password"
                aria-label="New password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-700">
                  {errors.password.message}
                </p>
              )}

              {message && <p className="text-sm text-red-700">{message}</p>}

              <div className="flex gap-2">
                <Button
                  className="px-3 py-2 text-sm"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
                <Button
                  className="px-3 py-2 text-sm"
                  variant="outline"
                  type="button"
                  disabled={isSubmitting}
                  onClick={cancelEditing}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex items-center justify-between gap-4">
                <span>{user.email}</span>
                {user.email !== "a@a.pl" && (
                  <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <Button
                      className="px-3 py-2 text-sm"
                      variant="outline"
                      type="button"
                      onClick={() => startEditing(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="px-3 py-2 text-sm"
                      variant="danger"
                      type="button"
                      disabled={deletingUserId === user.id}
                      onClick={() => deleteUser(user)}
                    >
                      {deletingUserId === user.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                )}
              </div>
              {deleteError?.userId === user.id && (
                <p className="mt-2 text-sm text-red-700">
                  {deleteError.message}
                </p>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
