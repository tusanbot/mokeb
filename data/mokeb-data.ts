import type { Donation, Goal, Program } from "@/types/mokeb";

export const goals: Goal[] = [
    {
        id: "goal-1",
        title: "خدمت‌رسانی به زائران",
        description:
            "فراهم‌کردن امکانات اولیه و خدمات مورد نیاز زائران در طول فعالیت موکب.",
        budget: 150_000_000,
        spent: 85_000_000,
        progress: 57,
        status: "active",
        subGoals: [
            {
                id: "sub-1-1",
                title: "تهیه آب و نوشیدنی",
                description: "تأمین آب آشامیدنی و نوشیدنی مورد نیاز زائران.",
                budget: 30_000_000,
                spent: 28_000_000,
                progress: 93,
                completed: false,
            },
            {
                id: "sub-1-2",
                title: "تأمین مواد غذایی",
                description: "خرید و آماده‌سازی مواد اولیه پذیرایی.",
                budget: 70_000_000,
                spent: 42_000_000,
                progress: 60,
                completed: false,
            },
            {
                id: "sub-1-3",
                title: "تجهیز محل استقرار",
                description: "فراهم‌کردن تجهیزات مورد نیاز محل خدمت‌رسانی.",
                budget: 50_000_000,
                spent: 15_000_000,
                progress: 30,
                completed: false,
            },
        ],
    },

    {
        id: "goal-2",
        title: "برگزاری برنامه‌های فرهنگی و مذهبی",
        description:
            "برگزاری برنامه‌های فرهنگی، مذهبی و معرفتی با محوریت معارف اهل‌بیت(ع).",
        budget: 80_000_000,
        spent: 52_000_000,
        progress: 65,
        status: "active",
        subGoals: [
            {
                id: "sub-2-1",
                title: "برگزاری مراسم مذهبی",
                budget: 35_000_000,
                spent: 25_000_000,
                progress: 71,
                completed: false,
            },
            {
                id: "sub-2-2",
                title: "برنامه‌های فرهنگی",
                budget: 25_000_000,
                spent: 17_000_000,
                progress: 68,
                completed: false,
            },
            {
                id: "sub-2-3",
                title: "تولید محتوای فرهنگی",
                budget: 20_000_000,
                spent: 10_000_000,
                progress: 50,
                completed: false,
            },
        ],
    },

    {
        id: "goal-3",
        title: "توسعه زیرساخت موکب",
        description:
            "تکمیل تجهیزات و زیرساخت‌هایی که موجب افزایش کیفیت و ظرفیت خدمت‌رسانی موکب می‌شوند.",
        budget: 120_000_000,
        spent: 30_000_000,
        progress: 25,
        status: "planning",
        subGoals: [
            {
                id: "sub-3-1",
                title: "خرید تجهیزات آشپزخانه",
                budget: 60_000_000,
                spent: 20_000_000,
                progress: 33,
                completed: false,
            },
            {
                id: "sub-3-2",
                title: "تجهیز فضای استراحت",
                budget: 40_000_000,
                spent: 10_000_000,
                progress: 25,
                completed: false,
            },
            {
                id: "sub-3-3",
                title: "تکمیل تجهیزات خدماتی",
                budget: 20_000_000,
                spent: 0,
                progress: 0,
                completed: false,
            },
        ],
    },
];

export const donations: Donation[] = [
    {
        id: "donation-1",
        donorName: "نیکوکار",
        type: "cash",
        amount: 10_000_000,
        description: "نذر نقدی برای تأمین مواد غذایی",
        date: "۱۴۰۵/۰۵/۲۰",
    },
    {
        id: "donation-2",
        donorName: "خیر گرامی",
        type: "cash",
        amount: 5_000_000,
        description: "کمک نقدی جهت خدمت‌رسانی به زائران",
        date: "۱۴۰۵/۰۵/۱۸",
    },
    {
        id: "donation-3",
        type: "goods",
        description: "اهدای یک محموله آب معدنی",
        date: "۱۴۰۵/۰۵/۱۵",
    },
];

export const programs: Program[] = [
    {
        id: "program-1",
        title: "آماده‌سازی محل موکب",
        description:
            "آماده‌سازی تجهیزات، فضای خدمت‌رسانی و امکانات مورد نیاز موکب.",
        date: "۱۴۰۵/۰۵/۲۸",
        time: "۸:۰۰",
        location: "محل استقرار موکب",
        status: "upcoming",
    },
    {
        id: "program-2",
        title: "برگزاری مراسم مذهبی",
        description:
            "برنامه فرهنگی و مذهبی با حضور خادمان و زائران.",
        date: "۱۴۰۵/۰۶/۰۲",
        time: "۲۰:۰۰",
        location: "محل موکب",
        status: "upcoming",
    },
    {
        id: "program-3",
        title: "آغاز خدمت‌رسانی",
        description:
            "شروع رسمی فعالیت موکب و خدمت‌رسانی به زائران.",
        date: "۱۴۰۵/۰۶/۰۵",
        time: "۷:۰۰",
        location: "موکب خادم الرضا(ع)",
        status: "upcoming",
    },
];