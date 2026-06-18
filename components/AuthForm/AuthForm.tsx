"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "@/components/Button/Button";

const authFormSchema = z.object({
  email: z.email(),
  password: z.string().trim().min(1, "Password is required"),
});

type AuthFormData = z.infer<typeof authFormSchema>;

export default function AuthForm() {
  const router = useRouter();
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
    resolver: zodResolver(authFormSchema),
  });

  async function onSubmit(formData: AuthFormData) {
    setMessage("");
    setIsError(false);

    try {
      const endpoint = isRegistering ? "/api/users" : "/api/auth/login";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        const errorMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.error ||
            data.message ||
            (isRegistering ? "Could not create the user." : "Could not log in.");

        if (isRegistering && response.status === 409) {
          setError("email", { message: errorMessage });
          return;
        }

        setIsError(true);
        setMessage(errorMessage);
        return;
      }

      reset();
      setIsError(false);

      if (isRegistering) {
        setMessage("User created successfully.");
      } else {
        router.push("/auth/users");
      }
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
          <label
            className="mt-2 flex items-center justify-between text-sm font-bold"
            htmlFor="email"
          >
            <span>Email</span>
            {!isRegistering && (
              <span className="font-normal text-slate-400">(a@a.pl)</span>
            )}
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

          <label
            className="mt-2 flex items-center justify-between text-sm font-bold"
            htmlFor="password"
          >
            <span>Password</span>
            {!isRegistering && (
              <span className="font-normal text-slate-400">(a)</span>
            )}
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

          <Button
            className="mt-4"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Submitting..."
              : isRegistering
                ? "Create account"
                : "Log in"}
          </Button>
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
