import { toJalaali } from "jalaali-js";

function toPersianDigits(value: string | number) {
    return String(value).replace(/\d/g, (digit) => {
        return "۰۱۲۳۴۵۶۷۸۹"[Number(digit)];
    });
}

export function formatPersianDate(
    date: string | Date | null | undefined
) {
    if (!date) {
        return "—";
    }

    const value =
        date instanceof Date
            ? date
            : new Date(date);

    if (Number.isNaN(value.getTime())) {
        return "—";
    }

    const {
        jy,
        jm,
        jd,
    } = toJalaali(
        value.getFullYear(),
        value.getMonth() + 1,
        value.getDate()
    );

    return toPersianDigits(
        `${jy}/${String(jm).padStart(
            2,
            "0"
        )}/${String(jd).padStart(2, "0")}`
    );
}

export function formatPersianDateLong(
    date: string | Date | null | undefined
) {
    if (!date) {
        return "—";
    }

    const value =
        date instanceof Date
            ? date
            : new Date(date);

    if (Number.isNaN(value.getTime())) {
        return "—";
    }

    const {
        jy,
        jm,
        jd,
    } = toJalaali(
        value.getFullYear(),
        value.getMonth() + 1,
        value.getDate()
    );

    const months = [
        "فروردین",
        "اردیبهشت",
        "خرداد",
        "تیر",
        "مرداد",
        "شهریور",
        "مهر",
        "آبان",
        "آذر",
        "دی",
        "بهمن",
        "اسفند",
    ];

    return `${toPersianDigits(jd)} ${months[jm - 1]
        } ${toPersianDigits(jy)}`;
}