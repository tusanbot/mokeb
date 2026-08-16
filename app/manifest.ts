import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "موکب خادم الرضا(ع)",

        short_name: "خادم الرضا",

        description:
            "اهداف، برنامه‌ها و گزارش نذورات موکب خادم الرضا(ع)",

        start_url: "/",

        scope: "/",

        display: "standalone",

        background_color: "#ffffff",

        theme_color: "#09967c",

        orientation: "portrait",

        lang: "fa",

        dir: "rtl",

        icons: [
            {
                src: "/icons/icon-192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icons/icon-512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}