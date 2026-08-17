"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DeleteGoalButton({ goalId, goalTitle }: { goalId: string; goalTitle: string }) {
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        if (!window.confirm(`هدف «${goalTitle}» حذف شود؟\n\nتمام ریزاهداف این هدف نیز حذف خواهند شد.`)) return;

        setLoading(true);
        const supabase = createClient();
        const { error } = await supabase.from("goals").delete().eq("id", goalId);

        if (error) {
            console.error("DELETE GOAL ERROR:", error);
            window.alert(error.message || "حذف هدف با خطا مواجه شد.");
            setLoading(false);
            return;
        }

        window.location.reload();
    }

    return (
        <button type="button" onClick={handleDelete} disabled={loading} className="flex items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50">
            <Trash2 size={15} />
            {loading ? "در حال حذف..." : "حذف"}
        </button>
    );
}
