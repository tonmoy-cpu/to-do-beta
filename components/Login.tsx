"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { login, register } from "@/redux/actions";
import { RootState } from "@/redux/store";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage,AvatarFallback } from "@radix-ui/react-avatar";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-avataaars-sprites";

const Login = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("avatar1");
  const [error, setError] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);
  const users = useSelector((state: RootState) => state.auth.users || []);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    console.log("Login component - Current user state:", user);
    console.log("Login component - Registered users:", users);
  }, [user, users]);

  const avatarOptions = [
    { id: "avatar1", seed: "John" },
    { id: "avatar2", seed: "Jane" },
    { id: "avatar3", seed: "Alex" },
    { id: "avatar4", seed: "Sarah" },
    { id: "avatar5", seed: "Mike" },
    { id: "avatar6", seed: "Emily" },
  ];

  const generateAvatarSvg = (seed: string) => {
    return createAvatar(style, { seed, size: 100 });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      const foundUser = users.find(
        (u) => u.username === username && u.password === password
      );
      if (foundUser) {
        console.log("Found user:", foundUser);
        dispatch(login(username));
        setError("");
      } else {
        setError("Invalid username or password");
      }
    } else {
      setError("Please enter both username and password");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password && confirmPassword) {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (users.some((u) => u.username === username)) {
        setError("Username already exists");
        return;
      }
      dispatch(register({ username, password, avatar }));
      setError("");
      setIsRegisterMode(false);
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setAvatar("avatar1");
    } else {
      setError("Please fill in all fields");
    }
  };

  useEffect(() => {
    if (user) {
      console.log("User logged in, redirecting to home...");
      router.push("/");
    }
  }, [user, router]);

  if (user) {
    return <div>Redirecting to home...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isRegisterMode ? "Register" : "Login"}
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter username"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter password"
            />
          </div>
          {isRegisterMode && (
            <>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Confirm password"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="avatar"
                >
                  Select Avatar
                </label>
                <select
                  id="avatar"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {avatarOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.id}
                    </option>
                  ))}
                </select>
                <div className="mt-2 flex justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={`data:image/svg+xml;utf8,${encodeURIComponent(
                        generateAvatarSvg(avatarOptions.find((opt) => opt.id === avatar)?.seed || "John")
                      )}`}
                      alt="Preview Avatar"
                    />
                    <AvatarFallback className="bg-gray-200 text-gray-700">
                      {username[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {isRegisterMode ? "Register" : "Login"}
          </button>
        </form>
        <button
          onClick={() => setIsRegisterMode(!isRegisterMode)}
          className="w-full text-blue-500 underline mt-4"
        >
          {isRegisterMode ? "Switch to Login" : "Switch to Register"}
        </button>
      </div>
    </div>
  );
};

export default Login;