import {
    Banknote,
    HandHeart,
    HandHelping,
    Package,
} from "lucide-react";

import type { Donation } from "@/types/mokeb";

type DonationCardProps = {
    donation: Donation;
};

const typeConfig = {
    cash: {
        label: "نذر نقدی",
        icon: Banknote,
        className:
            "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    goods: {
        label: "اهدای کالا",
        icon: Package,
        className:
            "bg-amber-50 text-amber-700 border-amber-200",
    },
    service: {
        label: "اهدای خدمت",
        icon: HandHelping,
        className:
            "bg-blue-50 text-blue-700 border-blue-200",
    },
};

function formatPrice(amount?: number) {
    if (amount === undefined || amount === null) {
        return null;
    }

    return new Intl.NumberFormat("fa-IR").format(amount);
}

export default function DonationCard({
    donation,
}: DonationCardProps) {
    const type = typeConfig[donation.type];
    const TypeIcon = type.icon;

    return (
        <article className="group rounded-[2rem] border border-[var(--border)] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6">
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] transition-transform duration-300 group-hover:scale-105">
                    <TypeIcon
                        size={22}
                        strokeWidth={1.7}
                    />

                    <div className="absolute -bottom-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[var(--gold)]">
                        <HandHeart
                            size={10}
                            className="text-white"
                        />
                    </div>
                </div>

                <div className="min-w-0 flex-1">
                    {/* Top Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${type.className}`}
                        >
                            <TypeIcon size={13} />

                            <span>
                                {type.label}
                            </span>
                        </span>

                        <time
                            dateTime={donation.date}
                            className="text-xs text-[var(--muted)]"
                        >
                            {donation.date}
                        </time>
                    </div>

                    {/* Donor */}
                    {donation.donorName && (
                        <h3 className="mt-3 text-sm font-extrabold text-[var(--primary-dark)]">
                            {donation.donorName}
                        </h3>
                    )}

                    {/* Description */}
                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                        {donation.description}
                    </p>

                    {/* Amount */}
                    {donation.amount !== undefined && (
                        <div className="mt-4 flex items-center justify-between rounded-2xl bg-[var(--surface-muted)] px-4 py-3">
                            <span className="text-xs text-[var(--muted)]">
                                مبلغ نذر
                            </span>

                            <span className="text-sm font-black text-[var(--primary)]">
                                {formatPrice(donation.amount)}

                                <span className="mr-1 text-xs font-normal text-[var(--muted)]">
                                    تومان
                                </span>
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}