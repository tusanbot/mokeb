"use client";

import { FormEvent, useState } from "react";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setLoading(true);

        const supabase = createClient();

        const { data, error } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        if (error) {
            setError(
                "ایمیل یا رمز عبور صحیح نیست."
            );

            setLoading(false);

            return;
        }

        if (!data.user) {
            setError(
                "ورود انجام نشد. دوباره تلاش کنید."
            );

            setLoading(false);

            return;
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();

        if (!profile || profile.role !== "admin") {
            await supabase.auth.signOut();

            setError(
                "این حساب دسترسی مدیریت ندارد."
            );

            setLoading(false);

            return;
        }

        router.push("/admin");
        router.refresh();
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-10">
            <div className="w-full max-w-md">
                {/* Logo / Icon */}
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-lg">
                        <ShieldCheck
                            size={30}
                            strokeWidth={1.7}
                        />
                    </div>

                    <h1 className="mt-5 text-2xl font-black text-[var(--primary-dark)]">
                        مدیریت موکب
                    </h1>

                    <p className="mt-2 text-sm text-[var(--muted)]">
                        برای ورود به پنل مدیریت وارد شوید
                    </p>
                </div>

                {/* Login Card */}
                <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-xl sm:p-8">
                    <form
                        onSubmit={handleLogin}
                        className="space-y-5"
                    >
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-bold text-[var(--primary-dark)]"
                            >
                                ایمیل مدیر
                            </label>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                                />

                                <input
                                    id="email"
                                    type="email"
                                    dir="ltr"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="admin@example.com"
                                    required
                                    autoComplete="email"
                                    className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] pr-11 pl-4 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-bold text-[var(--primary-dark)]"
                            >
                                رمز عبور
                            </label>

                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                                />

                                <input
                                    id="password"
                                    type="password"
                                    dir="ltr"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                    className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] pr-11 pl-4 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                role="alert"
                                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                            >
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--primary)] px-5 text-sm font-bold text-white transition hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "در حال ورود..."
                                : "ورود به پنل مدیریت"}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-[var(--muted)]">
                    دسترسی به این بخش فقط برای مدیر موکب امکان‌پذیر است.
                </p>
            </div>
        </main>
    );
}