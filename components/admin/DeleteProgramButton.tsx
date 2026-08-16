"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export function DeleteProgramButton({
    programId,
    programTitle,
}: {
    programId: string;
    programTitle: string;
}) {
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        const confirmed = window.confirm(
            `آیا از حذف برنامه «${programTitle}» مطمئن هستید؟`
        );

        if (!confirmed) {
            return;
        }

        setLoading(true);

        try {
            const supabase = createClient();

            const { error } = await supabase
                .from("programs")
                .delete()
                .eq("id", programId);

            if (error) {
                console.error(error);

                alert(
                    "حذف برنامه با خطا مواجه شد."
                );

                return;
            }

            window.location.reload();
        } catch (error) {
            console.error(error);

            alert(
                "خطایی در ارتباط با سامانه رخ داد."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            title="حذف برنامه"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
            <Trash2 size={16} />
        </button>
    );
}