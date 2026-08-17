import {
    ArrowLeft,
    HeartHandshake,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-[var(--primary-dark)] text-white">
            <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full border border-[var(--gold)]/15" aria-hidden="true" />
            <div className="pointer-events-none absolute right-1/2 top-1/2 h-80 w-80 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/[0.025]" aria-hidden="true" />

            <div className="container relative">
                <div className="grid min-h-[560px] items-center gap-14 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
                    <div className="max-w-2xl">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/30 bg-white/[0.06] px-4 py-2 text-sm text-[var(--gold-light)]">
                            <Sparkles size={16} strokeWidth={1.8} />
                            <span>به نام خداوند بخشنده و مهربان</span>
                        </div>

                        <h1 className="text-4xl font-black leading-[1.5] tracking-tight sm:text-5xl lg:text-6xl">
                            اهداف و برنامه‌های
                            <span className="mt-2 block text-[var(--gold)]">
                                موکب خادم الرضا(ع)
                            </span>
                        </h1>

                        <p className="mt-7 max-w-xl text-base leading-8 text-white/75 sm:text-lg">
                            اینجا روایت خدمت است؛ از اهداف و برنامه‌های موکب تا نذورات
                            و هزینه‌هایی که با همراهی شما برای خدمت به زائران و برگزاری
                            برنامه‌های فرهنگی و مذهبی اختصاص می‌یابد.
                        </p>

                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            <a href="#goals" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#b88b30]">
                                <span>مشاهده اهداف موکب</span>
                                <ArrowLeft size={18} className="transition-transform duration-200 group-hover:-translate-x-1" />
                            </a>

                            <a href="#donations" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/[0.1]">
                                <HeartHandshake size={18} strokeWidth={1.8} />
                                <span>مشاهده نذورات</span>
                            </a>
                        </div>

                        <div className="mt-8 flex items-center gap-3 text-sm text-white/55">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
                                <ShieldCheck size={20} strokeWidth={1.7} />
                            </div>
                            <span>گزارش شفاف اهداف، برنامه‌ها و نذورات موکب</span>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                        <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl">
                            <div className="absolute inset-6 rounded-[1.5rem] border border-[var(--gold)]/20" aria-hidden="true" />
                            <div className="absolute inset-12 rounded-full border border-white/10" aria-hidden="true" />
                            <div className="absolute inset-20 rounded-full border border-[var(--gold)]/10" aria-hidden="true" />

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-[2rem] border-2 border-[var(--gold)]/60 bg-[var(--gold)]/10 p-1 shadow-[0_0_80px_rgba(199,154,59,0.18)] sm:h-36 sm:w-36">
                                        <img
                                            src="/logo.png"
                                            alt="لوگوی موکب خادم الرضا(ع)"
                                            width="144"
                                            height="144"
                                            className="h-full w-full rounded-[1.5rem] object-cover"
                                        />
                                    </div>

                                    <div className="mt-7 text-xl font-bold">خادم الرضا(ع)</div>
                                    <div className="mt-2 text-sm text-white/50">به عشق خدمت</div>
                                </div>
                            </div>

                            <div className="absolute right-5 top-5 h-3 w-3 rounded-full bg-[var(--gold)]" aria-hidden="true" />
                            <div className="absolute bottom-5 left-5 h-3 w-3 rounded-full bg-[var(--gold)]" aria-hidden="true" />
                            <div className="absolute bottom-5 right-5 h-2 w-2 rounded-full bg-white/30" aria-hidden="true" />
                            <div className="absolute left-5 top-5 h-2 w-2 rounded-full bg-white/30" aria-hidden="true" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
