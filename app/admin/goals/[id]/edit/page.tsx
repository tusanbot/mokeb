import { notFound } from "next/navigation";
import GoalForm from "@/components/admin/GoalForm";
import { createClient } from "@/lib/supabase/server";

export default async function EditGoalPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: goal, error } = await supabase
        .from("goals")
        .select("id, title, description, budget, spent, progress, status, sub_goals(id, title, description, budget, spent, progress, completed)")
        .eq("id", id)
        .single();

    if (error || !goal) notFound();

    return (
        <GoalForm
            mode="edit"
            goalId={goal.id}
            initial={{
                title: goal.title,
                description: goal.description ?? "",
                budget: String(goal.budget ?? 0),
                spent: String(goal.spent ?? 0),
                progress: String(goal.progress ?? 0),
                status: goal.status,
                subGoals: (goal.sub_goals ?? []).map((item) => ({
                    id: item.id,
                    title: item.title,
                    description: item.description ?? "",
                    budget: String(item.budget ?? 0),
                    spent: String(item.spent ?? 0),
                    progress: String(item.progress ?? 0),
                    completed: Boolean(item.completed),
                })),
            }}
        />
    );
}
