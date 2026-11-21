"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { updateUserProfile, changePassword } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/PatientUI";
import { SettingsIcon, UserIcon, ShieldIcon } from "@/components/Icons";

const inputClass =
  "w-full rounded-xl border border-primary/15 bg-blush-soft/60 px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 disabled:opacity-60";

export default function SettingsPage() {
  return (
    <div className="animate-fade-up">
      <PageHeader icon={SettingsIcon} title="Settings" subtitle="Manage your profile and account security." />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ProfileForm />
        <PasswordForm />
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="rounded-3xl bg-white border border-primary/10 p-6">
      <div className="flex items-center gap-3 mb-5">
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-blush text-primary">
          <Icon className="w-5 h-5" />
        </span>
        <div>
          <h2 className="font-bold text-ink">{title}</h2>
          <p className="text-xs text-ink/60">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Label({ children }) {
  return <label className="block text-xs font-semibold text-ink/70 mb-1.5">{children}</label>;
}

function Feedback({ status }) {
  if (!status) return null;
  return (
    <p
      className={`text-sm rounded-xl px-3 py-2 ${
        status.ok ? "bg-green-50 text-green-700" : "bg-blush text-primary-dark"
      }`}
    >
      {status.message}
    </p>
  );
}

function ProfileForm() {
  const { user, loginUser } = useAuth();
  const [status, setStatus] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm({ defaultValues: { name: user.name, contactNumber: user.contactNumber || "" } });

  async function onSubmit(data) {
    setStatus(null);
    try {
      const updated = await updateUserProfile(user.id, data);
      loginUser(updated);
      reset(data);
      setStatus({ ok: true, message: "Profile updated." });
    } catch (e) {
      setStatus({ ok: false, message: e.message });
    }
  }

  return (
    <Card icon={UserIcon} title="Profile" subtitle="This is how doctors see you.">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <Label>Full name</Label>
          <input className={inputClass} {...register("name", { required: "Name is required" })} />
          {errors.name && <p className="text-primary text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label>Email</Label>
          <input className={inputClass} value={user.email} disabled readOnly />
          <p className="text-[11px] text-ink/50 mt-1">Email is used to sign in and can&apos;t be changed.</p>
        </div>
        <div>
          <Label>Contact number</Label>
          <input
            className={inputClass}
            {...register("contactNumber", { required: "Contact number is required" })}
          />
          {errors.contactNumber && (
            <p className="text-primary text-xs mt-1">{errors.contactNumber.message}</p>
          )}
        </div>
        <Feedback status={status} />
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="self-start px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark shadow-[var(--shadow-glow)] transition disabled:opacity-50 disabled:shadow-none cursor-pointer"
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </form>
    </Card>
  );
}

function PasswordForm() {
  const { user, loginUser } = useAuth();
  const [status, setStatus] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit({ currentPassword, newPassword }) {
    setStatus(null);
    try {
      const updated = await changePassword(user.id, { currentPassword, newPassword });
      loginUser(updated);
      reset();
      setStatus({ ok: true, message: "Password changed successfully." });
    } catch (e) {
      setStatus({ ok: false, message: e.message });
    }
  }

  return (
    <Card icon={ShieldIcon} title="Security" subtitle="Update your password regularly.">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <Label>Current password</Label>
          <input
            type="password"
            className={inputClass}
            {...register("currentPassword", { required: "Enter your current password" })}
          />
          {errors.currentPassword && (
            <p className="text-primary text-xs mt-1">{errors.currentPassword.message}</p>
          )}
        </div>
        <div>
          <Label>New password</Label>
          <input
            type="password"
            className={inputClass}
            {...register("newPassword", {
              required: "Enter a new password",
              minLength: { value: 6, message: "At least 6 characters" },
            })}
          />
          {errors.newPassword && <p className="text-primary text-xs mt-1">{errors.newPassword.message}</p>}
        </div>
        <div>
          <Label>Confirm new password</Label>
          <input
            type="password"
            className={inputClass}
            {...register("confirmPassword", {
              validate: (v, values) => v === values.newPassword || "Passwords don't match",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-primary text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
        <Feedback status={status} />
        <button
          type="submit"
          disabled={isSubmitting}
          className="self-start px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark shadow-[var(--shadow-glow)] transition disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Updating..." : "Update password"}
        </button>
      </form>
    </Card>
  );
}
