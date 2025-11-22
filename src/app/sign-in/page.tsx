"use client";
import React, { useState } from "react";
import { API_URL } from "@/shared";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUsername(value);
  };

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please fix errors before submitting.");
      return;
    }

    try {
      const res = await fetch(API_URL + "account/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (res.ok) {
        router.push("/list");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create account");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg text-white">
      <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block mb-1">
            Username
          </label>
          <input
            id="username"
            value={username}
            onChange={onUsernameChange}
            className="w-full p-2 border rounded text-black"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={onPasswordChange}
            className="w-full p-2 border rounded text-black"
          />
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            disabled={!username || !password}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
          >
            Sign in
          </button>
          <button
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
            onClick={(event) => {
              event.preventDefault();
              router.push("/sign-up");
            }}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
