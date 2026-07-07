"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/services/admin-api";

export function useApiQuery<T>(path: string, enabled = false) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await adminApi<T>(path);
      setData(result);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    if (enabled) {
      window.setTimeout(() => void refetch(), 0);
    }
  }, [enabled, refetch]);

  return { data, loading, error, refetch };
}
