"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
    ArrowRight,
    Banknote,
    CalendarDays,
    HandHeart,
    HandHelping,
    Package,
    Save,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import PersianDatePicker from "@/components/admin/PersianDatePicker";

type DonationType = "cash" | "goods" | "service";

export default function NewDonationPage() {
    const [donorName, setDonorName] = useState("");
    const [type, setType] =
        useState<DonationType>("cash");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [addToBalance, setAddToBalance] =
        useState(true);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    function handleTypeChange(
        newType: DonationType
    ) {
        setType(newType);

        // فقط نذر نقدی می‌تواند وارد موجودی شود
        if (newType !== "cash") {
            setAddToBalance(false);
        }
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setSuccess(false);

        if (
            addToBalance &&
            type === "cash" &&
            (!amount || Number(amount) <= 0)
        ) {
            setError(
                "برای افزودن نذر به موجودی، مبلغ معتبر وارد کنید."
            );

            return;
        }

        setLoading(true);

        try {
            const supabase = createClient();

            const { error: rpcError } =
                await supabase.rpc(
                    "create_donation",
                    {
                        p_donor_name:
                            donorName.trim() || null,

                        p_type: type,

                        p_amount:
                            amount.trim() === ""
                                ? null
                                : Number(amount),

                        p_description:
                            description.trim(),

                        p_date: date,

                        p_add_to_balance:
                            addToBalance,
                    }
                );

            if (rpcError) {
                console.error(rpcError);

                setError(
                    rpcError.message ||
                    "ثبت نذر با خطا مواجه شد."
                );

                setLoading(false);

                return;
            }

            setSuccess(true);

            setDonorName("");
            setType("cash");
            setAmount("");
            setDescription("");
            setDate(
                new Date()
                    .toISOString()
                    .split("T")[0]
            );
            setAddToBalance(true);
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
                        href="/admin/donations"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--primary)] transition hover:bg-[var(--primary-light)]"
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
                                ثبت نذر جدید
                            </h1>
                        </div>

                        <p className="mt-1 text-xs text-[var(--muted)]">
                            ثبت نذر و در صورت نیاز اعمال آن در موجودی موکب
                        </p>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {/* Main Card */}
                    <section className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-7">
                        <div className="mb-6">
                            <h2 className="font-black text-[var(--primary-dark)]">
                                اطلاعات نذر
                            </h2>

                            <p className="mt-1 text-xs leading-6 text-[var(--muted)]">
                                اطلاعات نذر را وارد کنید.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {/* Donor */}
                            <div>
                                <label
                                    htmlFor="donorName"
                                    className="mb-2 block text-sm font-bold text-[var(--primary-dark)]"
                                >
                                    نام نذردهنده
                                    <span className="mr-1 text-xs font-normal text-[var(--muted)]">
                                        (اختیاری)
                                    </span>
                                </label>

                                <input
                                    id="donorName"
                                    type="text"
                                    value={donorName}
                                    onChange={(event) =>
                                        setDonorName(
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="مثلاً: علی رضایی"
                                    className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="mb-3 block text-sm font-bold text-[var(--primary-dark)]">
                                    نوع نذر
                                </label>

                                <div className="grid gap-3 sm:grid-cols-3">
                                    <TypeButton
                                        active={
                                            type === "cash"
                                        }
                                        icon={
                                            <Banknote
                                                size={20}
                                            />
                                        }
                                        title="نقدی"
                                        description="وجه نقد"
                                        onClick={() =>
                                            handleTypeChange(
                                                "cash"
                                            )
                                        }
                                    />

                                    <TypeButton
                                        active={
                                            type ===
                                            "goods"
                                        }
                                        icon={
                                            <Package
                                                size={20}
                                            />
                                        }
                                        title="کالا"
                                        description="اقلام و اجناس"
                                        onClick={() =>
                                            handleTypeChange(
                                                "goods"
                                            )
                                        }
                                    />

                                    <TypeButton
                                        active={
                                            type ===
                                            "service"
                                        }
                                        icon={
                                            <HandHelping
                                                size={20}
                                            />
                                        }
                                        title="خدمت"
                                        description="ارائه خدمت"
                                        onClick={() =>
                                            handleTypeChange(
                                                "service"
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            {/* Amount */}
                            <div>
                                <label
                                    htmlFor="amount"
                                    className="mb-2 block text-sm font-bold text-[var(--primary-dark)]"
                                >
                                    مبلغ نذر
                                    {type !== "cash" && (
                                        <span className="mr-1 text-xs font-normal text-[var(--muted)]">
                                            (اختیاری)
                                        </span>
                                    )}
                                </label>

                                <div className="relative">
                                    <input
                                        id="amount"
                                        type="number"
                                        min="0"
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
                                        placeholder="مثلاً 5000000"
                                        className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 pl-16 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                    />

                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--muted)]">
                                        تومان
                                    </span>
                                </div>
                            </div>

                            {/* Add to balance */}
                            {type === "cash" && (
                                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                                    <input
                                        type="checkbox"
                                        checked={
                                            addToBalance
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setAddToBalance(
                                                event
                                                    .target
                                                    .checked
                                            )
                                        }
                                        className="mt-1 h-4 w-4 accent-[var(--primary)]"
                                    />

                                    <span>
                                        <span className="block text-sm font-bold text-emerald-800">
                                            مبلغ نذر به موجودی موکب اضافه شود
                                        </span>

                                        <span className="mt-1 block text-xs leading-6 text-emerald-700">
                                            با فعال بودن این گزینه،
                                            مبلغ نذر به عنوان یک
                                            واریزی مالی ثبت می‌شود.
                                        </span>
                                    </span>
                                </label>
                            )}

                            {/* Non cash info */}
                            {type !== "cash" && (
                                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-800">
                                    نذرهای کالایی و خدماتی در
                                    فهرست نذورات ثبت می‌شوند،
                                    اما به موجودی نقدی موکب اضافه
                                    نخواهند شد.
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="mb-2 block text-sm font-bold text-[var(--primary-dark)]"
                                >
                                    توضیحات
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
                                    placeholder="توضیحات مربوط به نذر..."
                                    className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm leading-7 outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                />
                            </div>

                            {/* Date */}
                            <div>
                                <label
                                    htmlFor="date"
                                    className="mb-2 block text-sm font-bold text-[var(--primary-dark)]"
                                >
                                    تاریخ ثبت
                                </label>

                                <PersianDatePicker
                                    id="date"
                                    value={date}
                                    onChange={setDate}
                                    placeholder="انتخاب تاریخ نذر"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Messages */}
                    {error && (
                        <div
                            role="alert"
                            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
                        >
                            {error}
                        </div>
                    )}

                    {success && (
                        <div
                            role="status"
                            className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-700"
                        >
                            نذر با موفقیت ثبت شد.
                            {addToBalance &&
                                type === "cash" &&
                                " مبلغ آن نیز به موجودی موکب اضافه شد."}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/admin/donations"
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
                                : "ثبت نذر"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}


/* =========================================================
   Type Button
========================================================= */

function TypeButton({
    active,
    icon,
    title,
    description,
    onClick,
}: {
    active: boolean;
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-2xl border p-4 text-right transition ${active
                ? "border-[var(--primary)] bg-[var(--primary-light)]"
                : "border-[var(--border)] bg-white hover:border-[var(--primary)]/40"
                }`}
        >
            <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${active
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--background)] text-[var(--primary)]"
                    }`}
            >
                {icon}
            </div>

            <p className="mt-3 text-sm font-black text-[var(--primary-dark)]">
                {title}
            </p>

            <p className="mt-1 text-[11px] text-[var(--muted)]">
                {description}
            </p>
        </button>
    );
}