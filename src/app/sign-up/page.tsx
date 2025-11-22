"use client";
import React, { useState } from "react";
import { API_URL } from "@/shared";
import { useRouter } from "next/router";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");

  const router = useRouter();

  const hasErrors = () => {
    return !!usernameError || !!passwordError || !!repeatPasswordError;
  };

  const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUsername(value);

    if (value.length < 3) {
      setUsernameError("Please enter at least 3 characters");
    } else {
      setUsernameError("");
    }
  };

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);

    if (value.length < 7) {
      setPasswordError("Password must be at least 7 characters");
    } else {
      setPasswordError("");
    }

    if (repeatPassword && value !== repeatPassword) {
      setRepeatPasswordError("Passwords do not match");
    } else {
      setRepeatPasswordError("");
    }
  };

  const onRepeatPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setRepeatPassword(value);

    if (password && value !== password) {
      setRepeatPasswordError("Passwords do not match");
    } else {
      setRepeatPasswordError("");
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (hasErrors() || !username || !password || !repeatPassword) {
      alert("Please fix errors before submitting.");
      return;
    }

    try {
      const res = await fetch(API_URL + "account/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          repeatPassword,
        }),
      });

      if (res.ok) {
        alert("Account created successfully!");
        router.push("/sign-in");
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
            aria-invalid={!!usernameError}
            aria-errormessage="usernameError"
          />
          {usernameError && (
            <p id="usernameError" className="text-red-500 text-sm mt-1">
              {usernameError}
            </p>
          )}
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
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
        </div>

        <div>
          <label htmlFor="repeatPassword" className="block mb-1">
            Repeat Password
          </label>
          <input
            id="repeatPassword"
            type="password"
            value={repeatPassword}
            onChange={onRepeatPasswordChange}
            className="w-full p-2 border rounded text-black"
          />
          {repeatPasswordError && (
            <p className="text-red-500 text-sm mt-1">{repeatPasswordError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={hasErrors()}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default SignUp;
