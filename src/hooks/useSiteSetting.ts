import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSiteSetting(key: string, defaultValue = "") {
  const { data, isLoading } = useQuery({
    queryKey: ["site_setting", key],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      return data?.value ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });
  return { value: data ?? defaultValue, isLoading, isSet: data !== null && data !== undefined };
}

export function useBoolSetting(key: string, defaultValue = true) {
  const { value, isLoading } = useSiteSetting(key, defaultValue ? "true" : "false");
  return { enabled: value === "true", isLoading };
}
