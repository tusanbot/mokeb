"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const navigation = [
    { label: "اهداف موکب", href: "#goals" },
    { label: "نذورات", href: "#donations" },
    { label: "برنامه‌های آتی", href: "#programs" },
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/95 backdrop-blur-md">
            <div className="container">
                <div className="flex h-20 items-center justify-between gap-6">
                    <a
                        href="/"
                        className="flex min-w-0 items-center gap-3"
                        aria-label="موکب خادم الرضا"
                    >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--gold)] bg-[var(--primary)] p-0.5 shadow-sm">
                            <img
                                src="/logo.png"
                                alt="لوگوی موکب خادم الرضا(ع)"
                                width="48"
                                height="48"
                                className="h-full w-full rounded-[10px] object-cover"
                            />
                        </div>

                        <div className="min-w-0">
                            <div className="truncate text-base font-extrabold text-[var(--primary-dark)] sm:text-lg">
                                موکب خادم الرضا(ع)
                            </div>

                            <div className="hidden text-xs text-[var(--muted)] sm:block">
                                خدمت به زائران، به عشق امام رضا(ع)
                            </div>
                        </div>
                    </a>

                    <nav
                        className="hidden items-center gap-1 md:flex"
                        aria-label="منوی اصلی"
                    >
                        {navigation.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <a
                        href="/admin/login"
                        className="hidden shrink-0 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)] md:flex"
                    >
                        <span>ورود مدیریت</span>
                    </a>

                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((open) => !open)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--primary)] transition hover:bg-[var(--primary-light)] md:hidden"
                        aria-label={isMenuOpen ? "بستن منو" : "باز کردن منو"}
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="border-t border-[var(--border)] py-4 md:hidden">
                        <nav className="flex flex-col gap-1" aria-label="منوی موبایل">
                            {navigation.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="rounded-xl px-4 py-3 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
                                >
                                    {item.label}
                                </a>
                            ))}

                            <a
                                href="/admin/login"
                                className="mt-2 rounded-xl bg-[var(--primary)] px-4 py-3 text-center text-sm font-semibold text-white"
                            >
                                ورود مدیریت
                            </a>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
