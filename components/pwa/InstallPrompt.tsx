"use client";

import { useEffect, useState } from "react";
import {
    Download,
    X,
    Smartphone,
} from "lucide-react";

interface BeforeInstallPromptEvent
    extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{
        outcome: "accepted" | "dismissed";
    }>;
}

export default function InstallPrompt() {
    const [installEvent, setInstallEvent] =
        useState<BeforeInstallPromptEvent | null>(null);

    const [showPrompt, setShowPrompt] =
        useState(false);

    const [isIOS, setIsIOS] =
        useState(false);

    const [isStandalone, setIsStandalone] =
        useState(false);

    useEffect(() => {
        const standalone =
            window.matchMedia(
                "(display-mode: standalone)"
            ).matches ||
            // iOS Safari
            (
                window.navigator as Navigator & {
                    standalone?: boolean;
                }
            ).standalone === true;

        setIsStandalone(standalone);

        if (standalone) {
            return;
        }

        const ios =
            /iPad|iPhone|iPod/.test(
                navigator.userAgent
            ) ||
            (
                navigator.platform ===
                "MacIntel" &&
                navigator.maxTouchPoints > 1
            );

        setIsIOS(ios);

        const handleBeforeInstallPrompt = (
            event: Event
        ) => {
            event.preventDefault();

            setInstallEvent(
                event as BeforeInstallPromptEvent
            );

            setShowPrompt(true);
        };

        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt
        );

        const handleAppInstalled = () => {
            setShowPrompt(false);
            setInstallEvent(null);
        };

        window.addEventListener(
            "appinstalled",
            handleAppInstalled
        );

        return () => {
            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstallPrompt
            );

            window.removeEventListener(
                "appinstalled",
                handleAppInstalled
            );
        };
    }, []);

    async function handleInstall() {
        if (!installEvent) {
            return;
        }

        await installEvent.prompt();

        const choice =
            await installEvent.userChoice;

        if (choice.outcome === "accepted") {
            setShowPrompt(false);
        }

        setInstallEvent(null);
    }

    function handleClose() {
        setShowPrompt(false);

        // اگر کاربر فعلاً نخواست،
        // تا پایان همین session نمایش داده نشود.
        sessionStorage.setItem(
            "mokeb-pwa-dismissed",
            "true"
        );
    }

    useEffect(() => {
        const dismissed =
            sessionStorage.getItem(
                "mokeb-pwa-dismissed"
            );

        if (dismissed === "true") {
            setShowPrompt(false);
        }
    }, []);

    if (isStandalone || !showPrompt) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[9999] sm:left-auto sm:right-6 sm:w-[380px]">
            <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-white p-4 shadow-2xl">
                {/* Close */}
                <button
                    type="button"
                    onClick={handleClose}
                    aria-label="بستن"
                    className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted)] transition hover:bg-[var(--background)]"
                >
                    <X size={17} />
                </button>

                <div className="flex items-start gap-3 pl-8">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)]">
                        <Smartphone size={23} />
                    </div>

                    <div className="min-w-0">
                        <h3 className="font-black text-[var(--primary-dark)]">
                            اپلیکیشن موکب
                        </h3>

                        <p className="mt-1 text-xs leading-6 text-[var(--muted)]">
                            برای دسترسی سریع‌تر، موکب خادم
                            الرضا(ع) را روی گوشی خود نصب کنید.
                        </p>
                    </div>
                </div>

                {isIOS ? (
                    <div className="mt-4 rounded-2xl bg-[var(--background)] p-3 text-xs leading-6 text-[var(--primary-dark)]">
                        برای نصب در آیفون، از منوی
                        <strong className="mx-1">
                            Share
                        </strong>
                        گزینه
                        <strong className="mx-1">
                            Add to Home Screen
                        </strong>
                        را انتخاب کنید.
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={handleInstall}
                        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-sm font-bold text-white transition hover:bg-[var(--primary-dark)]"
                    >
                        <Download size={18} />

                        نصب اپلیکیشن
                    </button>
                )}
            </div>
        </div>
    );
}