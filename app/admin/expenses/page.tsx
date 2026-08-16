import Link from "next/link";
import {
    ArrowRight,
    ArrowUpRight,
    Plus,
    Receipt,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { formatPersianDateLong } from "@/lib/date";

export default async function AdminExpensesPage() {
    const supabase = await createClient();

    const { data: expenses, error } = await supabase
        .from("expenses")
        .select("*")
        .order("date", {
            ascending: false,
        })
        .order("created_at", {
            ascending: false,
        });

    const items = expenses ?? [];

    const totalExpenses = items.reduce(
        (sum, item) => sum + Number(item.amount ?? 0),
        0
    );

    const formatMoney = (value: number) =>
        value.toLocaleString("fa-IR");

    return (
        <main className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <header className="border-b border-[var(--border)] bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin"
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
                                    مدیریت هزینه‌ها
                                </h1>
                            </div>

                            <p className="mt-1 text-xs text-[var(--muted)]">
                                ثبت و مدیریت هزینه‌های انجام‌شده موکب
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/admin/expenses/new"
                        className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--primary-dark)]"
                    >
                        <Plus size={18} />

                        <span className="hidden sm:inline">
                            ثبت هزینه جدید
                        </span>

                        <span className="sm:hidden">
                            ثبت هزینه
                        </span>
                    </Link>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Summary */}
                <section className="mb-8 grid gap-4 sm:grid-cols-2">
                    <SummaryCard
                        title="تعداد هزینه‌ها"
                        value={items.length.toLocaleString(
                            "fa-IR"
                        )}
                    />

                    <SummaryCard
                        title="مجموع هزینه‌ها"
                        value={`${formatMoney(
                            totalExpenses
                        )} تومان`}
                    />
                </section>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        دریافت اطلاعات هزینه‌ها با خطا مواجه شد.
                    </div>
                )}

                {/* Expenses */}
                <section className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-sm">
                    <div className="border-b border-[var(--border)] px-5 py-5">
                        <h2 className="font-black text-[var(--primary-dark)]">
                            فهرست هزینه‌ها
                        </h2>

                        <p className="mt-1 text-xs text-[var(--muted)]">
                            تمام هزینه‌های ثبت‌شده در سامانه
                        </p>
                    </div>

                    {items.length === 0 ? (
                        <div className="px-5 py-16 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                                <Receipt size={28} />
                            </div>

                            <h3 className="mt-4 font-black text-[var(--primary-dark)]">
                                هنوز هزینه‌ای ثبت نشده است
                            </h3>

                            <p className="mt-2 text-sm text-[var(--muted)]">
                                اولین هزینه موکب را ثبت کنید.
                            </p>

                            <Link
                                href="/admin/expenses/new"
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white"
                            >
                                <Plus size={17} />

                                ثبت هزینه جدید
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-[var(--border)]">
                            {items.map((expense) => (
                                <ExpenseRow
                                    key={expense.id}
                                    category={
                                        expense.category
                                    }
                                    amount={Number(
                                        expense.amount
                                    )}
                                    description={
                                        expense.description
                                    }
                                    date={expense.date}
                                    formatMoney={
                                        formatMoney
                                    }
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}


/* =========================================================
   Summary Card
========================================================= */

function SummaryCard({
    title,
    value,
}: {
    title: string;
    value: string;
}) {
    return (
        <div className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-[var(--muted)]">
                {title}
            </p>

            <p className="mt-3 text-xl font-black text-[var(--primary-dark)]">
                {value}
            </p>
        </div>
    );
}


/* =========================================================
   Expense Row
========================================================= */

function ExpenseRow({
    category,
    amount,
    description,
    date,
    formatMoney,
}: {
    category: string;
    amount: number;
    description: string;
    date: string;
    formatMoney: (value: number) => string;
}) {
    return (
        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <ArrowUpRight size={19} />
                </div>

                <div className="min-w-0">
                    <h3 className="font-bold text-[var(--primary-dark)]">
                        {category}
                    </h3>

                    <p className="mt-1 text-xs leading-6 text-[var(--muted)]">
                        {description ||
                            "بدون توضیحات"}
                    </p>
                </div>
            </div>

            <div className="shrink-0 sm:text-left">
                <p className="text-sm font-black text-red-600">
                    -{formatMoney(amount)} تومان
                </p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                    {formatPersianDateLong(date)}
                </p>
            </div>
        </div>
    );
}