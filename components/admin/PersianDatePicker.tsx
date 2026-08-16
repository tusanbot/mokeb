"use client";

import DatePicker, {
    DateObject,
} from "react-multi-date-picker";

import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";

import persian_fa from "react-date-object/locales/persian_fa";
import gregorian_en from "react-date-object/locales/gregorian_en";

type PersianDatePickerProps = {
    value: string;
    onChange: (value: string) => void;
    id?: string;
    placeholder?: string;
};

export default function PersianDatePicker({
    value,
    onChange,
    id,
    placeholder = "انتخاب تاریخ",
}: PersianDatePickerProps) {
    /**
     * مقدار ذخیره‌شده در دیتابیس Gregorian است:
     * 2026-08-16
     *
     * ابتدا آن را Gregorian می‌سازیم
     * سپس به Persian تبدیل می‌کنیم.
     */
    const currentValue = value
        ? new DateObject({
            date: value,
            calendar: gregorian,
            locale: gregorian_en,
        }).convert(persian, persian_fa)
        : null;

    return (
        <DatePicker
            id={id}
            value={currentValue}
            onChange={(date) => {
                if (!date) {
                    onChange("");
                    return;
                }

                const dateObject = Array.isArray(date)
                    ? date[0]
                    : date;

                if (!dateObject) {
                    onChange("");
                    return;
                }

                /**
                 * تاریخ انتخاب‌شده شمسی است.
                 * قبل از ذخیره، آن را به Gregorian تبدیل می‌کنیم.
                 */
                const gregorianDate =
                    dateObject.convert(
                        gregorian,
                        gregorian_en
                    );

                onChange(
                    gregorianDate.format("YYYY-MM-DD")
                );
            }}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            format="YYYY/MM/DD"
            placeholder={placeholder}
            inputClass="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
            containerClassName="w-full"
            className="rtl"
        />
    );
}