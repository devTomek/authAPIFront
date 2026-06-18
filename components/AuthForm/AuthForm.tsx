"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const authSchema = z.object({
  email: z.email(),
  password: z.string().trim().min(1, "Password is required"),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function AuthForm() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  async function onSubmit(formData: AuthFormData) {
    setMessage("");
    setIsError(false);

    if (!isRegistering) {
      setMessage("Login will be connected in the next step.");
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        const errorMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "Could not create the user.";

        if (response.status === 409) {
          setError("email", { message: data.error });
          return;
        }

        setIsError(true);
        setMessage(errorMessage);
        return;
      }

      reset();
      setIsError(false);
      setMessage("User created successfully.");
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  }

  function changeMode(registering: boolean) {
    setIsRegistering(registering);
    clearErrors();
    setIsError(false);
    setMessage("");
  }

  return (
    <section className="grid min-h-screen place-items-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="mb-2 text-3xl font-bold">
          {isRegistering ? "Create account" : "Log in"}
        </h1>
        <p className="mb-6 text-slate-500">
          {isRegistering
            ? "Create a user through the Auth API."
            : "Log in to your account."}
        </p>

        <div className="mb-6 grid grid-cols-2 border-b border-slate-200">
          <button
            type="button"
            className={`cursor-pointer border-b-2 px-3 py-2.5 ${
              !isRegistering
                ? "border-emerald-700 font-bold text-emerald-700"
                : "border-transparent text-slate-500"
            }`}
            onClick={() => changeMode(false)}
          >
            Log in
          </button>
          <button
            type="button"
            className={`cursor-pointer border-b-2 px-3 py-2.5 ${
              isRegistering
                ? "border-emerald-700 font-bold text-emerald-700"
                : "border-transparent text-slate-500"
            }`}
            onClick={() => changeMode(true)}
          >
            Register
          </button>
        </div>

        <form
          className="flex flex-col gap-2"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <label className="mt-2 text-sm font-bold" htmlFor="email">
            Email
          </label>
          <input
            className={`rounded-lg border p-3 ${
              errors.email ? "border-red-600" : "border-slate-300"
            }`}
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-700">{errors.email.message}</p>
          )}

          <label className="mt-2 text-sm font-bold" htmlFor="password">
            Password
          </label>
          <input
            className={`rounded-lg border p-3 ${
              errors.password ? "border-red-600" : "border-slate-300"
            }`}
            id="password"
            type="password"
            placeholder="Your password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-700">{errors.password.message}</p>
          )}

          <button
            className="mt-4 cursor-pointer rounded-lg bg-emerald-700 p-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Submitting..."
              : isRegistering
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-sm ${
              isError ? "text-red-700" : "text-emerald-700"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
