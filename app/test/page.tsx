import { createClient } from "@/lib/supabase/server";

export default async function TestPage() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("goals")
        .select("*")
        .limit(5);

    return (
        <main className="min-h-screen p-8">
            <h1 className="text-2xl font-bold">
                Supabase Test
            </h1>

            <pre className="mt-6 overflow-auto rounded-xl bg-slate-100 p-4 text-sm">
                {JSON.stringify(
                    {
                        data,
                        error,
                    },
                    null,
                    2
                )}
            </pre>
        </main>
    );
}