import {
    Banknote,
    HandHeart,
    HandHelping,
    Package,
    Sparkles,
} from "lucide-react";

import type { Donation } from "@/types/mokeb";
import DonationCard from "./DonationCard";

type DonationsSectionProps = {
    donations: Donation[];
};

export default function DonationsSection({
    donations,
}: DonationsSectionProps) {
    const cashDonations = donations.filter(
        (donation) => donation.type === "cash"
    );

    const totalCash = cashDonations.reduce(
        (sum, donation) => sum + (donation.amount ?? 0),
        0
    );

    const goodsCount = donations.filter(
        (donation) => donation.type === "goods"
    ).length;

    const serviceCount = donations.filter(
        (donation) => donation.type === "service"
    ).length;

    return (
        <section
            id="donations"
            className="section bg-white"
        >
            <div className="container">
                {/* Header */}
                <div className="section-header">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--gold-light)] px-4 py-2 text-xs font-bold text-[#8c681d]">
                        <Sparkles size={14} />

                        <span>
                            نذورات و همراهی خیرین
                        </span>
                    </div>

                    <h2 className="section-title">
                        نذورات موکب
                    </h2>

                    <p className="section-description">
                        بخشی از خدمت موکب با نذورات و همراهی خیرین گرامی انجام می‌شود.
                        در این بخش می‌توانید آخرین نذورات ثبت‌شده را مشاهده کنید.
                    </p>
                </div>

                {/* Summary */}
                <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Cash Total */}
                    <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-5 transition hover:shadow-md">
                        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                            <Banknote
                                size={17}
                                className="text-[var(--primary)]"
                            />

                            <span>
                                مجموع نذورات نقدی
                            </span>
                        </div>

                        <div className="mt-3 text-xl font-black text-[var(--primary)]">
                            {totalCash.toLocaleString("fa-IR")}

                            <span className="mr-1 text-xs font-normal text-[var(--muted)]">
                                تومان
                            </span>
                        </div>
                    </div>

                    {/* Cash Count */}
                    <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-5 transition hover:shadow-md">
                        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                            <HandHeart
                                size={17}
                                className="text-[var(--primary)]"
                            />

                            <span>
                                نذورات نقدی
                            </span>
                        </div>

                        <div className="mt-3 text-2xl font-black text-[var(--primary-dark)]">
                            {cashDonations.length.toLocaleString("fa-IR")}
                        </div>
                    </div>

                    {/* Goods */}
                    <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-5 transition hover:shadow-md">
                        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                            <Package
                                size={17}
                                className="text-[var(--gold)]"
                            />

                            <span>
                                اهدای کالا
                            </span>
                        </div>

                        <div className="mt-3 text-2xl font-black text-[var(--primary-dark)]">
                            {goodsCount.toLocaleString("fa-IR")}
                        </div>
                    </div>

                    {/* Services */}
                    <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-5 transition hover:shadow-md">
                        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                            <HandHelping
                                size={17}
                                className="text-blue-600"
                            />

                            <span>
                                اهدای خدمت
                            </span>
                        </div>

                        <div className="mt-3 text-2xl font-black text-[var(--primary-dark)]">
                            {serviceCount.toLocaleString("fa-IR")}
                        </div>
                    </div>
                </div>

                {/* Donations */}
                {donations.length > 0 ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                        {donations.map((donation) => (
                            <DonationCard
                                key={donation.id}
                                donation={donation}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--background)] px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary-light)] text-[var(--primary)]">
                            <HandHeart size={24} />
                        </div>

                        <h3 className="mt-5 text-lg font-bold text-[var(--primary-dark)]">
                            هنوز نذری ثبت نشده است
                        </h3>

                        <p className="mt-2 text-sm text-[var(--muted)]">
                            نذورات ثبت‌شده در این بخش نمایش داده خواهند شد.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}