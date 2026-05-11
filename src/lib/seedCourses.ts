import { supabase } from "@/integrations/supabase/client";

// Calls the seed-courses edge function. Idempotent: function exits early if any course exists.
// Memoized per browser session to avoid hammering the network on every navigation.
let seedPromise: Promise<void> | null = null;

export function ensureDemoCoursesSeeded(): Promise<void> {
  if (seedPromise) return seedPromise;
  seedPromise = (async () => {
    try {
      await supabase.functions.invoke("seed-courses", { body: {} });
    } catch {
      // Best-effort — never block the UI on seeding.
    }
  })();
  return seedPromise;
}
