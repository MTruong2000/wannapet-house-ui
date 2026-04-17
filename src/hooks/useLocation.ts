"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface Location {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  is_default: boolean;
}

const LOCATION_KEY = "selected_location_slug";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const cookie = {
  get: (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(
      new RegExp(
        "(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)"
      )
    );
    return match ? decodeURIComponent(match[1]) : null;
  },
  set: (name: string, value: string, maxAge = 60 * 60 * 24 * 30) => {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; path=/; max-age=${maxAge}; samesite=lax`;
  },
};

const storage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
};

function persistSlug(slug: string) {
  storage.set(LOCATION_KEY, slug);
  cookie.set(LOCATION_KEY, slug);
}

export function useLocation() {
  const router = useRouter();
  const abortRef = useRef<AbortController | null>(null);

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    abortRef.current = new AbortController();

    const fetchLocations = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/locations`, {
          cache: "no-store",
          signal: abortRef.current!.signal,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: Location[] = await res.json();
        setLocations(data);

        const storedSlug =
          cookie.get(LOCATION_KEY) ?? storage.get(LOCATION_KEY);

        if (storedSlug && data.some((l) => l.slug === storedSlug)) {
          setSelectedSlug(storedSlug);
          persistSlug(storedSlug);
        } else {
          const fallback = data.find((l) => l.is_default) ?? data[0] ?? null;
          if (fallback) {
            setSelectedSlug(fallback.slug);
            persistSlug(fallback.slug);
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("[useLocation] fetch failed:", err);
        }
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    fetchLocations();
    return () => abortRef.current?.abort();
  }, []);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const selectLocation = useCallback(
    (slug: string) => {
      persistSlug(slug);
      setSelectedSlug(slug);
      setIsModalOpen(false);
      router.refresh();
    },
    [router]
  );

  const selectedLocation = useMemo(
    () => locations.find((l) => l.slug === selectedSlug) ?? null,
    [locations, selectedSlug]
  );

  return {
    locations,
    selectedSlug,
    selectedLocation,
    isModalOpen,
    loading,
    initialized,
    openModal,
    closeModal,
    selectLocation,
  };
}
