"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

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

function getCookie(name: string) {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp(
      "(^|; )" + name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + "=([^;]*)"
    )
  );

  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(
  name: string,
  value: string,
  maxAgeSeconds = 60 * 60 * 24 * 30
) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

export function useLocation() {
  const router = useRouter();

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const fetchLocations = useCallback(async () => {
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/locations`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch locations: ${res.status}`);
      }

      const data: Location[] = await res.json();
      setLocations(data);

      const cookieSlug = getCookie(LOCATION_KEY);
      const localSlug = localStorage.getItem(LOCATION_KEY);
      const storedSlug = cookieSlug || localSlug;

      if (storedSlug) {
        setSelectedSlug(storedSlug);

        if (cookieSlug !== storedSlug) {
          setCookie(LOCATION_KEY, storedSlug);
        }

        if (localSlug !== storedSlug) {
          localStorage.setItem(LOCATION_KEY, storedSlug);
        }

        return;
      }

      const defaultLoc = data.find((l) => l.is_default) ?? data[0] ?? null;

      if (defaultLoc) {
        setSelectedSlug(defaultLoc.slug);
        localStorage.setItem(LOCATION_KEY, defaultLoc.slug);
        setCookie(LOCATION_KEY, defaultLoc.slug);
      }
    } catch (err) {
      console.error("Failed to fetch locations", err);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const selectLocation = useCallback(
    (slug: string) => {
      localStorage.setItem(LOCATION_KEY, slug);
      setCookie(LOCATION_KEY, slug);
      setSelectedSlug(slug);
      setIsModalOpen(false);
      router.refresh();
    },
    [router]
  );

  const selectedLocation = useMemo(() => {
    return locations.find((l) => l.slug === selectedSlug) ?? null;
  }, [locations, selectedSlug]);

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
