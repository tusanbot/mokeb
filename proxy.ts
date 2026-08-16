import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },

                setAll(cookiesToSet) {
                    cookiesToSet.forEach(
                        ({ name, value }) => {
                            request.cookies.set(
                                name,
                                value
                            );
                        }
                    );

                    response = NextResponse.next({
                        request,
                    });

                    cookiesToSet.forEach(
                        ({
                            name,
                            value,
                            options,
                        }) => {
                            response.cookies.set(
                                name,
                                value,
                                options
                            );
                        }
                    );
                },
            },
        }
    );

    /*
     * مهم:
     * getUser() باعث می‌شود Session در صورت نیاز
     * توسط Supabase Refresh شود.
     */
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    /*
     * فقط صفحات Admin نیاز به احراز هویت دارند.
     */
    if (
        pathname.startsWith("/admin") &&
        pathname !== "/admin/login"
    ) {
        /*
         * اگر Session واقعاً وجود ندارد،
         * کاربر را به Login بفرست.
         */
        if (userError || !user) {
            return NextResponse.redirect(
                new URL(
                    "/admin/login",
                    request.url
                )
            );
        }

        /*
         * بررسی نقش مدیر
         */
        const {
            data: profile,
            error: profileError,
        } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .maybeSingle();

        /*
         * اگر پروفایل واقعاً پیدا نشد یا نقش مدیر نیست،
         * دسترسی رد شود.
         *
         * اما خطای موقت دیتابیس را با
         * "کاربر Logout شده" اشتباه نگیریم.
         */
        if (profileError) {
            console.error(
                "ADMIN PROFILE CHECK ERROR:",
                profileError.message
            );

            return response;
        }

        if (
            !profile ||
            profile.role !== "admin"
        ) {
            return NextResponse.redirect(
                new URL(
                    "/admin/login",
                    request.url
                )
            );
        }
    }

    return response;
}

export const config = {
    matcher: [
        "/admin/:path*",
    ],
};