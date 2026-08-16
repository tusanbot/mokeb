import {
    ArrowDownLeft,
    ArrowUpRight,
    Banknote,
    CalendarDays,
    ClipboardList,
    Coins,
    HandHeart,
    LayoutDashboard,
    Receipt,
    Target,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { formatPersianDateLong } from "@/lib/date";
import Link from "next/link";

export default async function AdminPage() {
    const supabase = await createClient();

    const [
        incomeResult,
        expenseResult,
        transactionsResult,
    ] = await Promise.all([
        supabase
            .from("financial_transactions")
            .select("amount")
            .eq("type", "income"),

        supabase
            .from("financial_transactions")
            .select("amount")
            .eq("type", "expense"),

        supabase
            .from("financial_transactions")
            .select(
                "id, type, category, amount, description, date"
            )
            .order("date", {
                ascending: false,
            })
            .limit(10),
    ]);

    const totalIncome =
        incomeResult.data?.reduce(
            (sum, item) => sum + Number(item.amount),
            0
        ) ?? 0;

    const totalExpenses =
        expenseResult.data?.reduce(
            (sum, item) => sum + Number(item.amount),
            0
        ) ?? 0;

    const balance = totalIncome - totalExpenses;

    const transactions =
        transactionsResult.data ?? [];

    const formatMoney = (value: number) =>
        value.toLocaleString("fa-IR");

    return (
        <main className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <header className="border-b border-[var(--border)] bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
                    <div>
                        <div className="flex items-center gap-2 text-[var(--primary)]">
                            <LayoutDashboard
                                size={20}
                            />

                            <span className="text-sm font-bold">
                                پنل مدیریت
                            </span>
                        </div>

                        <h1 className="mt-2 text-2xl font-black text-[var(--primary-dark)]">
                            مدیریت موکب خادم الرضا(ع)
                        </h1>
                    </div>

                    <div className="hidden items-center gap-2 rounded-xl bg-[var(--primary-light)] px-4 py-2 text-sm font-bold text-[var(--primary)] sm:flex">
                        <ShieldIcon />

                        مدیر موکب
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Financial Management */}
                <section>
                    <div className="mb-5">
                        <div className="flex items-center gap-2">
                            <Coins
                                size={22}
                                className="text-[var(--gold)]"
                            />

                            <h2 className="text-xl font-black text-[var(--primary-dark)]">
                                مدیریت مالی
                            </h2>
                        </div>

                        <p className="mt-1 text-sm text-[var(--muted)]">
                            وضعیت مالی و آخرین تراکنش‌های موکب
                        </p>
                    </div>

                    {/* Financial Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Balance */}
                        <FinancialCard
                            title="موجودی فعلی موکب"
                            value={balance}
                            icon={
                                <Banknote size={22} />
                            }
                            positive
                        />

                        {/* Income */}
                        <FinancialCard
                            title="مجموع واریزی‌ها"
                            value={totalIncome}
                            icon={
                                <ArrowDownLeft
                                    size={22}
                                />
                            }
                            positive
                        />

                        {/* Expenses */}
                        <FinancialCard
                            title="مجموع هزینه‌ها"
                            value={totalExpenses}
                            icon={
                                <ArrowUpRight
                                    size={22}
                                />
                            }
                        />
                    </div>

                    {/* Transactions */}
                    <div className="mt-6 overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
                            <div>
                                <h3 className="font-black text-[var(--primary-dark)]">
                                    آخرین تراکنش‌ها
                                </h3>

                                <p className="mt-1 text-xs text-[var(--muted)]">
                                    آخرین درآمدها و هزینه‌های ثبت‌شده
                                </p>
                            </div>

                            <Receipt
                                size={20}
                                className="text-[var(--gold)]"
                            />
                        </div>

                        {transactions.length === 0 ? (
                            <div className="px-5 py-12 text-center">
                                <Receipt
                                    size={34}
                                    className="mx-auto text-[var(--muted)]"
                                />

                                <p className="mt-3 text-sm font-bold text-[var(--primary-dark)]">
                                    هنوز تراکنشی ثبت نشده است
                                </p>

                                <p className="mt-1 text-xs text-[var(--muted)]">
                                    پس از ثبت نذورات نقدی یا هزینه‌ها،
                                    تراکنش‌ها در این قسمت نمایش داده می‌شوند.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[var(--border)]">
                                {transactions.map(
                                    (transaction) => {
                                        const isIncome =
                                            transaction.type ===
                                            "income";

                                        return (
                                            <div
                                                key={
                                                    transaction.id
                                                }
                                                className="flex items-center justify-between gap-4 px-5 py-4"
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div
                                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isIncome
                                                            ? "bg-emerald-50 text-emerald-600"
                                                            : "bg-red-50 text-red-600"
                                                            }`}
                                                    >
                                                        {isIncome ? (
                                                            <ArrowDownLeft
                                                                size={
                                                                    18
                                                                }
                                                            />
                                                        ) : (
                                                            <ArrowUpRight
                                                                size={
                                                                    18
                                                                }
                                                            />
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-bold text-[var(--primary-dark)]">
                                                            {
                                                                transaction.category
                                                            }
                                                        </p>

                                                        <p className="mt-1 truncate text-xs text-[var(--muted)]">
                                                            {
                                                                transaction.description
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="shrink-0 text-left">
                                                    <p
                                                        className={`text-sm font-black ${isIncome
                                                            ? "text-emerald-600"
                                                            : "text-red-600"
                                                            }`}
                                                    >
                                                        {isIncome
                                                            ? "+"
                                                            : "-"}
                                                        {formatMoney(
                                                            Number(
                                                                transaction.amount
                                                            )
                                                        )}{" "}
                                                        تومان
                                                    </p>

                                                    <p className="mt-1 text-[11px] text-[var(--muted)]">
                                                        {formatPersianDateLong(transaction.date)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Management Modules */}
                <section className="mt-10">
                    <div className="mb-5">
                        <h2 className="text-xl font-black text-[var(--primary-dark)]">
                            مدیریت محتوا
                        </h2>

                        <p className="mt-1 text-sm text-[var(--muted)]">
                            مدیریت بخش‌های مختلف سایت موکب
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Link href="/admin/goals">
                            <ManagementCard
                                title="اهداف"
                                description="مدیریت اهداف و ریزاهداف"
                                icon={
                                    <Target size={22} />
                                }
                            />
                        </Link>

                        <Link href="/admin/donations">
                            <ManagementCard
                                title="نذورات"
                                description="ثبت و مدیریت نذورات"
                                icon={
                                    <HandHeart size={22} />
                                }
                            />
                        </Link>

                        <Link href="/admin/expenses">
                            <ManagementCard
                                title="هزینه‌ها"
                                description="ثبت و مدیریت هزینه‌ها"
                                icon={
                                    <Receipt size={22} />
                                }
                            />
                        </Link>

                        <Link href="/admin/programs">
                            <ManagementCard
                                title="برنامه‌ها"
                                description="مدیریت برنامه‌های موکب"
                                icon={
                                    <CalendarDays size={22} />
                                }
                            />
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}


/* =========================================================
   Financial Card
========================================================= */

function FinancialCard({
    title,
    value,
    icon,
    positive = false,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    positive?: boolean;
}) {
    return (
        <div className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-bold text-[var(--muted)]">
                        {title}
                    </p>

                    <p
                        className={`mt-3 text-2xl font-black ${positive
                            ? "text-[var(--primary)]"
                            : "text-[var(--primary-dark)]"
                            }`}
                    >
                        {value.toLocaleString("fa-IR")}
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                        تومان
                    </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)]">
                    {icon}
                </div>
            </div>
        </div>
    );
}


/* =========================================================
   Management Card
========================================================= */

function ManagementCard({
    title,
    description,
    icon,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)]">
                {icon}
            </div>

            <h3 className="mt-4 font-black text-[var(--primary-dark)]">
                {title}
            </h3>

            <p className="mt-1 text-xs leading-6 text-[var(--muted)]">
                {description}
            </p>
        </div>
    );
}


/* =========================================================
   Shield Icon
========================================================= */

function ShieldIcon() {
    return (
        <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}