"use client";

import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    MapPin,
} from "lucide-react";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import { useEffect, useState } from "react";

import type { Program } from "@/types/mokeb";

dayjs.extend(jalaliday);

type ProgramCardProps = {
    program: Program;
};

const statusConfig = {
    upcoming: {
        label: "پیش‌رو",
        className:
            "bg-amber-50 text-amber-700 border-amber-200",
        icon: CalendarDays,
    },

    active: {
        label: "در حال برگزاری",
        className:
            "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: Clock3,
    },

    completed: {
        label: "برگزار شده",
        className:
            "bg-slate-100 text-slate-600 border-slate-200",
        icon: CheckCircle2,
    },
};

function toEnglishDigits(value: string) {
    return value.replace(/[۰-۹]/g, (digit) =>
        String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
    );
}


/* =========================================================
   Program Date
========================================================= */

function getProgramDate(program: Program) {
    const date = toEnglishDigits(
        program.date
    ).replace(/\//g, "-");

    const time = program.time
        ? toEnglishDigits(program.time)
        : "00:00";

    const [year, month, day] = date
        .split("-")
        .map(Number);

    const [hour = 0, minute = 0] = time
        .split(":")
        .map(Number);

    /*
     * تاریخ موجود در Supabase میلادی است.
     *
     * مثال:
     * 2026-08-17
     *
     * بنابراین نباید با jalali:true ساخته شود.
     */
    return dayjs(
        new Date(
            year,
            month - 1,
            day,
            hour,
            minute,
            0,
            0
        )
    );
}


/* =========================================================
   Persian Display Date
========================================================= */

function getPersianDate(program: Program) {
    const date = getProgramDate(program);

    return date
        .calendar("jalali")
        .locale("fa")
        .format("D MMMM YYYY");
}


/* =========================================================
   Countdown
========================================================= */

function getCountdown(program: Program) {
    const target = getProgramDate(program);
    const now = dayjs();

    const difference =
        target.valueOf() - now.valueOf();

    if (difference <= 0) {
        return {
            type: "past" as const,
            label: "زمان برنامه فرا رسیده است",
            days: 0,
            hours: 0,
            minutes: 0,
        };
    }

    const totalMinutes = Math.floor(
        difference / (1000 * 60)
    );

    const days = Math.floor(
        totalMinutes / (60 * 24)
    );

    const hours = Math.floor(
        (totalMinutes % (60 * 24)) / 60
    );

    const minutes = totalMinutes % 60;

    return {
        type: "upcoming" as const,
        label:
            days > 0
                ? `${days.toLocaleString(
                    "fa-IR"
                )} روز مانده`
                : "امروز",
        days,
        hours,
        minutes,
    };
}


/* =========================================================
   Component
========================================================= */

export default function ProgramCard({
    program,
}: ProgramCardProps) {
    const status =
        statusConfig[program.status];

    const StatusIcon = status.icon;

    const [countdown, setCountdown] =
        useState<ReturnType<
            typeof getCountdown
        > | null>(null);

    const [persianDate, setPersianDate] =
        useState("");

    useEffect(() => {
        /*
         * این محاسبات فقط روی Client انجام می‌شوند
         * تا دوباره مشکل Hydration ایجاد نشود.
         */
        setPersianDate(
            getPersianDate(program)
        );

        const updateCountdown = () => {
            setCountdown(
                getCountdown(program)
            );
        };

        updateCountdown();

        const interval =
            window.setInterval(
                updateCountdown,
                60 * 1000
            );

        return () => {
            window.clearInterval(interval);
        };
    }, [program]);

    return (
        <article className="group relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6">

            {/* Accent */}
            <div
                className="absolute right-0 top-0 h-full w-1 bg-[var(--gold)] transition-all duration-300 group-hover:w-1.5"
                aria-hidden="true"
            />

            <div className="flex gap-4 sm:gap-5">

                {/* Date */}
                <div className="flex w-[76px] shrink-0 flex-col items-center justify-start rounded-2xl bg-[var(--primary-light)] px-2 py-4 text-center sm:w-24">

                    <CalendarDays
                        size={19}
                        strokeWidth={1.7}
                        className="text-[var(--primary)]"
                    />

                    <span className="mt-2 text-[11px] font-medium text-[var(--muted)]">
                        تاریخ
                    </span>

                    <span className="mt-1 text-xs font-black leading-6 text-[var(--primary-dark)] sm:text-sm">
                        {persianDate ||
                            "در حال بارگذاری..."}
                    </span>

                    {program.time && (
                        <div className="mt-2 flex items-center gap-1 border-t border-[var(--primary)]/10 pt-2 text-[11px] font-semibold text-[var(--primary)]">

                            <Clock3 size={12} />

                            <span>
                                {program.time.slice(
                                    0,
                                    5
                                )}
                            </span>
                        </div>
                    )}
                </div>


                {/* Content */}
                <div className="min-w-0 flex-1">

                    {/* Status + Location */}
                    <div className="flex flex-wrap items-center gap-2">

                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
                        >
                            <StatusIcon size={13} />

                            <span>
                                {status.label}
                            </span>
                        </span>

                        {program.location && (
                            <span className="inline-flex items-center gap-1 text-xs text-[var(--muted)]">

                                <MapPin size={13} />

                                <span>
                                    {program.location}
                                </span>

                            </span>
                        )}

                    </div>


                    {/* Title */}
                    <h3 className="mt-4 text-lg font-extrabold leading-8 text-[var(--primary-dark)]">
                        {program.title}
                    </h3>


                    {/* Description */}
                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                        {program.description}
                    </p>


                    {/* Countdown */}
                    {program.status ===
                        "upcoming" && (
                            <div className="mt-5 rounded-2xl border border-[var(--gold)]/20 bg-[var(--gold-light)] p-4">

                                <div className="flex items-center justify-between gap-4">

                                    <div>

                                        <div className="text-xs font-medium text-[#8c681d]">
                                            زمان باقی‌مانده
                                        </div>

                                        <div className="mt-1 text-base font-black text-[var(--primary-dark)]">
                                            {countdown ===
                                                null
                                                ? "در حال محاسبه..."
                                                : countdown.label}
                                        </div>

                                    </div>

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--gold)] shadow-sm">
                                        <Clock3
                                            size={21}
                                        />
                                    </div>

                                </div>


                                {/* Today */}
                                {countdown !==
                                    null &&
                                    countdown.type ===
                                    "upcoming" &&
                                    countdown.days ===
                                    0 && (
                                        <div className="mt-3 flex items-center gap-2 border-t border-[var(--gold)]/10 pt-3 text-xs text-[#8c681d]">

                                            <span>
                                                {countdown.hours.toLocaleString(
                                                    "fa-IR"
                                                )}{" "}
                                                ساعت
                                            </span>

                                            <span>
                                                و
                                            </span>

                                            <span>
                                                {countdown.minutes.toLocaleString(
                                                    "fa-IR"
                                                )}{" "}
                                                دقیقه
                                            </span>

                                            <span>
                                                تا شروع برنامه
                                            </span>

                                        </div>
                                    )}


                                {/* More than one day */}
                                {countdown !==
                                    null &&
                                    countdown.type ===
                                    "upcoming" &&
                                    countdown.days >
                                    0 && (
                                        <div className="mt-3 flex items-center justify-between border-t border-[var(--gold)]/10 pt-3 text-xs text-[#8c681d]">

                                            <span>
                                                {countdown.days.toLocaleString(
                                                    "fa-IR"
                                                )}{" "}
                                                روز
                                            </span>

                                            <span>
                                                {countdown.hours.toLocaleString(
                                                    "fa-IR"
                                                )}{" "}
                                                ساعت
                                            </span>

                                            <span>
                                                {countdown.minutes.toLocaleString(
                                                    "fa-IR"
                                                )}{" "}
                                                دقیقه
                                            </span>

                                        </div>
                                    )}

                            </div>
                        )}


                    {/* Started Message */}
                    {program.status ===
                        "upcoming" &&
                        countdown !== null &&
                        countdown.type ===
                        "past" && (
                            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">

                                <CheckCircle2
                                    size={16}
                                />

                                <span>
                                    زمان این برنامه فرا رسیده است
                                </span>

                            </div>
                        )}

                </div>
            </div>
        </article>
    );
}