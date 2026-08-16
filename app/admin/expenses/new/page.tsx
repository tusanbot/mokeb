"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
    ArrowRight,
    CalendarDays,
    Receipt,
    Save,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import PersianDatePicker from "@/components/admin/PersianDatePicker";

export default function NewExpensePage() {
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setSuccess(false);

        if (!category.trim()) {
            setError("دسته‌بندی هزینه را وارد کنید.");
            return;
        }

        if (!amount || Number(amount) <= 0) {
            setError("مبلغ هزینه باید بیشتر از صفر باشد.");
            return;
        }

        setLoading(true);

        try {
            const supabase = createClient();

            const { error: rpcError } =
                await supabase.rpc(
                    "create_expense",
                    {
                        p_category:
                            category.trim(),

                        p_amount:
                            Number(amount),

                        p_description:
                            description.trim(),

                        p_date: date,
                    }
                );

            if (rpcError) {
                setError(
                    rpcError.message ||
                    "ثبت هزینه با خطا مواجه شد."
                );

                return;
            }

            setSuccess(true);

            setCategory("");
            setAmount("");
            setDescription("");
            setDate(
                new Date()
                    .toISOString()
                    .split("T")[0]
            );
        } catch (err) {
            console.error(err);

            setError(
                "خطایی در ارتباط با سامانه رخ داد."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <header className="border-b border-[var(--border)] bg-white">
                <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-5 sm:px-6">
                    <Link
                        href="/admin/expenses"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--primary)] transition hover:bg-[var(--primary-light)]"
                    >
                        <ArrowRight size={19} />
                    </Link>

                    <div>
                        <div className="flex items-center gap-2">
                            <Receipt
                                size={20}
                                className="text-[var(--gold)]"
                            />

                            <h1 className="text-xl font-black text-[var(--primary-dark)]">
                                ثبت هزینه جدید
                            </h1>
                        </div>

                        <p className="mt-1 text-xs text-[var(--muted)]">
                            ثبت هزینه و کسر خودکار آن از موجودی موکب
                        </p>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <section className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-7">
                        <div className="mb-6">
                            <h2 className="font-black text-[var(--primary-dark)]">
                                اطلاعات هزینه
                            </h2>

                            <p className="mt-1 text-xs leading-6 text-[var(--muted)]">
                                اطلاعات هزینه انجام‌شده را وارد کنید.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {/* Category */}
                            <div>
                                <label
                                    htmlFor="category"
                                    className="mb-2 block text-sm font-bold text-[var(--primary-dark)]"
                                >
                                    دسته‌بندی هزینه
                                </label>

                                <input
                                    id="category"
                                    type="text"
                                    value={category}
                                    onChange={(event) =>
                                        setCategory(
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="مثلاً: مواد غذایی، حمل‌ونقل، تجهیزات"
                                    className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                />
                            </div>

                            {/* Amount */}
                            <div>
                                <label
                                    htmlFor="amount"
                                    className="mb-2 block text-sm font-bold text-[var(--primary-dark)]"
                                >
                                    مبلغ هزینه
                                </label>

                                <div className="relative">
                                    <input
                                        id="amount"
                                        type="number"
                                        min="1"
                                        value={amount}
                                        onChange={(
                                            event
                                        ) =>
                                            setAmount(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="مثلاً 300000"
                                        className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 pl-16 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                    />

                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--muted)]">
                                        تومان
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="mb-2 block text-sm font-bold text-[var(--primary-dark)]"
                                >
                                    توضیحات
                                    <span className="mr-1 text-xs font-normal text-[var(--muted)]">
                                        (اختیاری)
                                    </span>
                                </label>

                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(
                                            event.target
                                                .value
                                        )
                                    }
                                    rows={4}
                                    placeholder="توضیحات مربوط به هزینه..."
                                    className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm leading-7 outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                />
                            </div>

                            {/* Date */}
                            <div>
                                <label
                                    htmlFor="date"
                                    className="mb-2 block text-sm font-bold text-[var(--primary-dark)]"
                                >
                                    تاریخ هزینه
                                </label>

                                <PersianDatePicker
                                    id="date"
                                    value={date}
                                    onChange={setDate}
                                    placeholder="انتخاب تاریخ هزینه"
                                />
                            </div>

                            {/* Warning */}
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-800">
                                مبلغ هزینه مستقیماً از موجودی نقدی
                                موکب کسر خواهد شد. در صورتی که
                                موجودی کافی نباشد، هزینه ثبت
                                نمی‌شود.
                            </div>
                        </div>
                    </section>

                    {/* Error */}
                    {error && (
                        <div
                            role="alert"
                            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
                        >
                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div
                            role="status"
                            className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-700"
                        >
                            هزینه با موفقیت ثبت شد و مبلغ آن
                            از موجودی موکب کسر شد.
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/admin/expenses"
                            className="flex h-12 items-center justify-center rounded-xl border border-[var(--border)] bg-white px-6 text-sm font-bold text-[var(--primary-dark)] transition hover:bg-[var(--background)]"
                        >
                            انصراف
                        </Link>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-7 text-sm font-bold text-white transition hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Save size={18} />

                            {loading
                                ? "در حال ثبت..."
                                : "ثبت هزینه"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}