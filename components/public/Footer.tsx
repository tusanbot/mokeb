export default function Footer() {
    return (
        <footer className="border-t border-[var(--border)] bg-[var(--primary-dark)] text-white">
            <div className="container">
                <div className="grid gap-10 py-14 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--gold)] bg-white/5 text-xl font-black text-[var(--gold)]">
                                ع
                            </div>

                            <div>
                                <div className="text-lg font-extrabold">
                                    موکب خادم الرضا(ع)
                                </div>

                                <div className="mt-1 text-xs text-white/50">
                                    خدمت به زائران، به عشق اهل‌بیت(ع)
                                </div>
                            </div>
                        </div>

                        <p className="mt-6 max-w-md text-sm leading-8 text-white/60">
                            این وب‌سایت با هدف اطلاع‌رسانی درباره اهداف، برنامه‌ها،
                            نذورات و فعالیت‌های موکب خادم الرضا(ع) ایجاد شده است.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-sm font-bold text-[var(--gold)]">
                            دسترسی سریع
                        </h3>

                        <nav className="mt-5 flex flex-col items-start gap-3">
                            <a
                                href="#goals"
                                className="text-sm text-white/60 transition hover:text-white"
                            >
                                اهداف موکب
                            </a>

                            <a
                                href="#donations"
                                className="text-sm text-white/60 transition hover:text-white"
                            >
                                نذورات
                            </a>

                            <a
                                href="#programs"
                                className="text-sm text-white/60 transition hover:text-white"
                            >
                                برنامه‌های آتی
                            </a>
                        </nav>
                    </div>

                    {/* Management */}
                    <div>
                        <h3 className="text-sm font-bold text-[var(--gold)]">
                            مدیریت موکب
                        </h3>

                        <p className="mt-5 text-sm leading-7 text-white/60">
                            مسئولین موکب می‌توانند از طریق پنل مدیریت، اهداف، نذورات،
                            هزینه‌ها و برنامه‌ها را مدیریت کنند.
                        </p>

                        <a
                            href="/login"
                            className="mt-5 inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            ورود به پنل مدیریت
                        </a>
                    </div>
                </div>

                {/* Bottom */}
                <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                        © {new Date().getFullYear()} موکب خادم الرضا(ع)
                    </span>

                    <span>
                        به نیت خدمت، برای رضای خدا
                    </span>
                </div>
            </div>
        </footer>
    );
}