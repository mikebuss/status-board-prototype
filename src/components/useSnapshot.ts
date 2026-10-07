"use client";

import { useEffect, useState } from "react";
import { REFRESH_MS, type Snapshot } from "@/lib/status";

export function useSnapshot(initial: Snapshot) {
  const [snapshot, setSnapshot] = useState(initial);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/status", { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const next: Snapshot = await res.json();
        if (!cancelled) {
          setSnapshot(next);
          setOffline(false);
        }
      } catch {
        if (!cancelled) setOffline(true);
      }
    };
    const id = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return { snapshot, offline };
}
