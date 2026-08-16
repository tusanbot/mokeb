import Link from "next/link";
import {
    ArrowRight,
    HandHeart,
    Plus,
    Banknote,
    Package,
    HandHelping,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { formatPersianDateLong } from "@/lib/date";


export default async function AdminDonationsPage() {
    const supabase = await createClient();

    const { data: donations, error } = await supabase
        .from("donations")
        .select("*")
        .order("date", {
            ascending: false,
        })
        .order("created_at", {
            ascending: false,
        });

    const items = donations ?? [];

    const formatMoney = (value: number) =>
        value.toLocaleString("fa-IR");

    const typeLabel = {
        cash: "نقدی",
        goods: "کالا",
        service: "خدمت",
    } as const;

    const typeIcon = {
        cash: <Banknote size={18} />,
        goods: <Package size={18} />,
        service: <HandHelping size={18} />,
    } as const;

    return (
        <main className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <header className="border-b border-[var(--border)] bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--primary)] transition hover:bg-[var(--primary-light)]"
                        >
                            <ArrowRight size={19} />
                        </Link>

                        <div>
                            <div className="flex items-center gap-2">
                                <HandHeart
                                    size={20}
                                    className="text-[var(--gold)]"
                                />

                                <h1 className="text-xl font-black text-[var(--primary-dark)]">
                                    مدیریت نذورات
                                </h1>
                            </div>

                            <p className="mt-1 text-xs text-[var(--muted)]">
                                ثبت و مدیریت نذورات موکب
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/admin/donations/new"
                        className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--primary-dark)]"
                    >
                        <Plus size={18} />

                        <span className="hidden sm:inline">
                            ثبت نذر جدید
                        </span>

                        <span className="sm:hidden">
                            ثبت نذر
                        </span>
                    </Link>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Summary */}
                <section className="mb-8 grid gap-4 sm:grid-cols-3">
                    <SummaryCard
                        title="تعداد نذورات"
                        value={items.length.toLocaleString(
                            "fa-IR"
                        )}
                    />

                    <SummaryCard
                        title="نذورات نقدی"
                        value={items
                            .filter(
                                (item) =>
                                    item.type === "cash"
                            )
                            .length.toLocaleString("fa-IR")}
                    />

                    <SummaryCard
                        title="مبالغ اعمال‌شده در موجودی"
                        value={`${formatMoney(
                            items
                                .filter(
                                    (item) =>
                                        item.type === "cash" &&
                                        item.add_to_balance &&
                                        item.amount
                                )
                                .reduce(
                                    (sum, item) =>
                                        sum +
                                        Number(
                                            item.amount ?? 0
                                        ),
                                    0
                                )
                        )} تومان`}
                    />
                </section>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        دریافت اطلاعات نذورات با خطا مواجه شد.
                    </div>
                )}

                {/* Donations */}
                <section className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-sm">
                    <div className="border-b border-[var(--border)] px-5 py-5">
                        <h2 className="font-black text-[var(--primary-dark)]">
                            فهرست نذورات
                        </h2>

                        <p className="mt-1 text-xs text-[var(--muted)]">
                            تمام نذورات ثبت‌شده در سامانه
                        </p>
                    </div>

                    {items.length === 0 ? (
                        <div className="px-5 py-16 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)]">
                                <HandHeart size={28} />
                            </div>

                            <h3 className="mt-4 font-black text-[var(--primary-dark)]">
                                هنوز نذری ثبت نشده است
                            </h3>

                            <p className="mt-2 text-sm text-[var(--muted)]">
                                اولین نذر موکب را ثبت کنید.
                            </p>

                            <Link
                                href="/admin/donations/new"
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white"
                            >
                                <Plus size={17} />

                                ثبت نذر جدید
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-[var(--border)]">
                            {items.map((donation) => (
                                <DonationRow
                                    key={donation.id}
                                    donation={donation}
                                    typeLabel={
                                        typeLabel[
                                        donation.type as keyof typeof typeLabel
                                        ] ??
                                        donation.type
                                    }
                                    icon={
                                        typeIcon[
                                        donation.type as keyof typeof typeIcon
                                        ] ?? (
                                            <HandHeart
                                                size={18}
                                            />
                                        )
                                    }
                                    formatMoney={formatMoney}
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
   Donation Row
========================================================= */

function DonationRow({
    donation,
    typeLabel,
    icon,
    formatMoney,
}: {
    donation: {
        id: string;
        donor_name: string | null;
        type: string;
        amount: number | null;
        description: string;
        date: string;
        add_to_balance: boolean;
    };
    typeLabel: string;
    icon: React.ReactNode;
    formatMoney: (value: number) => string;
}) {
    return (
        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)]">
                    {icon}
                </div>

                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-[var(--primary-dark)]">
                            {donation.donor_name ||
                                "خیر ناشناس"}
                        </h3>

                        <span className="rounded-full bg-[var(--background)] px-2.5 py-1 text-[11px] font-bold text-[var(--muted)]">
                            {typeLabel}
                        </span>

                        {donation.add_to_balance && (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
                                اعمال‌شده در موجودی
                            </span>
                        )}
                    </div>

                    <p className="mt-1 text-xs leading-6 text-[var(--muted)]">
                        {donation.description ||
                            "بدون توضیحات"}
                    </p>
                </div>
            </div>

            <div className="shrink-0 sm:text-left">
                {donation.amount !== null ? (
                    <p className="text-sm font-black text-[var(--primary)]">
                        {formatMoney(
                            Number(donation.amount)
                        )}{" "}
                        تومان
                    </p>
                ) : (
                    <p className="text-sm font-bold text-[var(--muted)]">
                        بدون مبلغ نقدی
                    </p>
                )}

                <p className="mt-1 text-xs text-[var(--muted)]">
                    {formatPersianDateLong(donation.date)}
                </p>
            </div>
        </div>
    );
}