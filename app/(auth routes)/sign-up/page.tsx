"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { register } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

import css from "./SignUpPage.module.css";

export default function SignUpPage() {
  const router = useRouter();

  const [error, setError] = useState("");

  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const form = event.currentTarget;

    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    try {
      const response = await register({
        email,
        password,
      });

      setUser(response.user);

      router.push("/profile");
    } catch {
      setError("Registration failed");
    }
  };

  return (
    <main className={css.container}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.title}>Sign up</h1>

        <div className={css.field}>
          <label htmlFor="email">Email</label>

          <input id="email" type="email" name="email" required />
        </div>

        <div className={css.field}>
          <label htmlFor="password">Password</label>

          <input id="password" type="password" name="password" required />
        </div>

        <button className={css.button} type="submit">
          Register
        </button>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
