"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { login } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginUser } = useAuth();
  const router = useRouter();

  async function onSubmit(formData) {
    setServerError("");
    setIsSubmitting(true);
    try {
      const user = await login(formData);
      loginUser(user);

      if (user.role === "ADMIN") router.push("/admin");
      else if (user.role === "DOCTOR") router.push("/doctor");
      else router.push("/doctors");
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white border rounded-lg p-6 shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
        </div>

        {serverError && <p className="text-red-600 text-sm">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-white py-2 rounded hover:bg-primary-dark disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-4">
        No account yet?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Register here
        </Link>
      </p>

      <div className="text-xs text-gray-500 mt-6 border-t pt-4">
        <p className="font-semibold mb-1">Demo accounts:</p>
        <p>Patient: patient@example.com / patient123</p>
        <p>Doctor: silva@example.com / doctor123</p>
        <p>Admin: admin@example.com / admin123</p>
      </div>
    </div>
  );
}
