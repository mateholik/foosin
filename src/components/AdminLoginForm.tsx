"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Login failed.");
      }

      router.refresh();
    } catch (submissionError) {
      const message =
        submissionError instanceof Error ? submissionError.message : "Login failed.";
      setError(message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="brut-panel space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-100">Admin Login</h2>
      <label className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="brut-input"
          required
        />
      </label>
      {error ? <p className="text-sm font-medium text-rose-300">{error}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="brut-btn-primary mt-1 w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
