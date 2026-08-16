import {
    Check,
    CheckCircle2,
    Circle,
    Target,
    WalletCards,
} from "lucide-react";

import type { Goal } from "@/types/mokeb";

type GoalCardProps = {
    goal: Goal;
};

const statusConfig = {
    planning: {
        label: "در حال برنامه‌ریزی",
        className: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Target,
    },
    active: {
        label: "در حال اجرا",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: Target,
    },
    completed: {
        label: "تکمیل شده",
        className: "bg-blue-50 text-blue-700 border-blue-200",
        icon: CheckCircle2,
    },
};

function formatPrice(amount: number) {
    return new Intl.NumberFormat("fa-IR").format(amount);
}

export default function GoalCard({ goal }: GoalCardProps) {
    const status = statusConfig[goal.status];
    const StatusIcon = status.icon;

    const remaining = Math.max(
        goal.budget - goal.spent,
        0
    );

    const progress = Math.min(
        Math.max(goal.progress, 0),
        100
    );

    return (
        <article className="group overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Main Content */}
            <div className="p-6 sm:p-7">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
                        >
                            <StatusIcon size={14} />

                            <span>
                                {status.label}
                            </span>
                        </div>

                        <h3 className="mt-4 text-xl font-extrabold leading-8 text-[var(--primary-dark)]">
                            {goal.title}
                        </h3>
                    </div>

                    {/* Goal Icon */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] transition-transform duration-300 group-hover:scale-105">
                        <Target
                            size={23}
                            strokeWidth={1.7}
                        />
                    </div>
                </div>

                {/* Description */}
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                    {goal.description}
                </p>

                {/* Progress */}
                <div className="mt-7">
                    <div className="mb-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[var(--primary-dark)]">
                                میزان پیشرفت
                            </span>
                        </div>

                        <span className="text-sm font-black text-[var(--primary)]">
                            {progress.toLocaleString("fa-IR")}٪
                        </span>
                    </div>

                    <div
                        className="h-3 overflow-hidden rounded-full bg-[var(--surface-muted)]"
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={progress}
                        aria-label={`پیشرفت ${goal.title}`}
                    >
                        <div
                            className="relative h-full overflow-hidden rounded-full bg-[var(--primary)] transition-all duration-700"
                            style={{
                                width: `${progress}%`,
                            }}
                        >
                            <div
                                className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white/20 to-transparent"
                                aria-hidden="true"
                            />
                        </div>
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-[var(--surface-muted)] p-4">
                        <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                            <WalletCards size={15} />

                            <span>
                                بودجه هدف
                            </span>
                        </div>

                        <div className="mt-2 text-sm font-black text-[var(--foreground)]">
                            {formatPrice(goal.budget)}

                            <span className="mr-1 text-xs font-normal text-[var(--muted)]">
                                تومان
                            </span>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-[var(--primary-light)] p-4">
                        <div className="flex items-center gap-2 text-xs text-[var(--primary)]">
                            <CheckCircle2 size={15} />

                            <span>
                                هزینه‌شده
                            </span>
                        </div>

                        <div className="mt-2 text-sm font-black text-[var(--primary-dark)]">
                            {formatPrice(goal.spent)}

                            <span className="mr-1 text-xs font-normal text-[var(--muted)]">
                                تومان
                            </span>
                        </div>
                    </div>
                </div>

                {/* Remaining */}
                <div className="mt-3 flex items-center justify-between rounded-2xl border border-[var(--border)] px-4 py-3">
                    <span className="text-xs text-[var(--muted)]">
                        اعتبار باقی‌مانده
                    </span>

                    <span className="text-sm font-bold text-[var(--primary-dark)]">
                        {formatPrice(remaining)}

                        <span className="mr-1 text-xs font-normal text-[var(--muted)]">
                            تومان
                        </span>
                    </span>
                </div>
            </div>

            {/* Sub Goals */}
            {goal.subGoals.length > 0 && (
                <div className="border-t border-[var(--border)] bg-[#fbfcfa] p-6 sm:p-7">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Target
                                size={17}
                                className="text-[var(--primary)]"
                            />

                            <h4 className="text-sm font-extrabold text-[var(--primary-dark)]">
                                ریزاهداف
                            </h4>
                        </div>

                        <span className="text-xs text-[var(--muted)]">
                            {goal.subGoals.length.toLocaleString("fa-IR")} مورد
                        </span>
                    </div>

                    <div className="space-y-3">
                        {goal.subGoals.map((subGoal) => {
                            const subProgress = Math.min(
                                Math.max(subGoal.progress, 0),
                                100
                            );

                            return (
                                <div
                                    key={subGoal.id}
                                    className="rounded-2xl border border-[var(--border)] bg-white p-4 transition-colors hover:border-[var(--primary)]/20"
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Completion */}
                                        <div
                                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${subGoal.completed
                                                    ? "bg-[var(--primary)] text-white"
                                                    : "border border-[var(--border)] text-[var(--muted)]"
                                                }`}
                                        >
                                            {subGoal.completed ? (
                                                <Check size={14} strokeWidth={2.5} />
                                            ) : (
                                                <Circle
                                                    size={14}
                                                    strokeWidth={1.5}
                                                />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <h5 className="text-sm font-bold text-[var(--foreground)]">
                                                    {subGoal.title}
                                                </h5>

                                                <span className="shrink-0 text-xs font-bold text-[var(--primary)]">
                                                    {subProgress.toLocaleString("fa-IR")}٪
                                                </span>
                                            </div>

                                            {subGoal.description && (
                                                <p className="mt-1 text-xs leading-6 text-[var(--muted)]">
                                                    {subGoal.description}
                                                </p>
                                            )}

                                            {/* Sub Progress */}
                                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                                                <div
                                                    className="h-full rounded-full bg-[var(--gold)] transition-all duration-700"
                                                    style={{
                                                        width: `${subProgress}%`,
                                                    }}
                                                />
                                            </div>

                                            {/* Financial Details */}
                                            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--muted)]">
                                                <span>
                                                    هزینه‌شده:{" "}
                                                    {formatPrice(subGoal.spent)} تومان
                                                </span>

                                                <span>
                                                    بودجه:{" "}
                                                    {formatPrice(subGoal.budget)} تومان
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </article>
    );
}