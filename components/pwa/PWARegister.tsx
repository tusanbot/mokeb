"use client";

import { useEffect } from "react";

export default function PWARegister() {
    useEffect(() => {
        if (
            typeof window === "undefined" ||
            !("serviceWorker" in navigator)
        ) {
            return;
        }

        if (process.env.NODE_ENV !== "production") {
            return;
        }

        window.addEventListener(
            "load",
            () => {
                navigator.serviceWorker
                    .register("/sw.js")
                    .then((registration) => {
                        console.log(
                            "PWA Service Worker registered:",
                            registration.scope
                        );
                    })
                    .catch((error) => {
                        console.error(
                            "PWA Service Worker registration failed:",
                            error
                        );
                    });
            }
        );
    }, []);

    return null;
}