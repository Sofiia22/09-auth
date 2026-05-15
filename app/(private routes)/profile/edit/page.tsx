"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { getMe, updateMe } from "@/lib/api/clientApi";
import { User } from "@/types/user";

import css from "./EditProfilePage.module.css";

export default function EditProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getMe();

      setUser(currentUser);
      setUsername(currentUser.username);
    };

    loadUser();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await updateMe({ username });

    router.push("/profile");
  };

  if (!user) {
    return <p className={css.loading}>Loading...</p>;
  }

  return (
    <main className={css.container}>
      <div className={css.card}>
        <h1 className={css.title}>Edit Profile</h1>

        <Image
          className={css.avatar}
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
        />

        <form className={css.form} onSubmit={handleSubmit}>
          <div className={css.field}>
            <label htmlFor="username">Username:</label>

            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          <p className={css.email}>Email: {user.email}</p>

          <div className={css.actions}>
            <button className={css.saveButton} type="submit">
              Save
            </button>

            <button
              className={css.cancelButton}
              type="button"
              onClick={() => router.push("/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
