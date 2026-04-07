"use client";

import { useEffect, useState } from "react";

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

export function useLocation() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LOCATION_KEY);
    if (stored) {
      setSelectedSlug(stored);
      return;
    }

    fetchLocations(true);
  }, []);

  const fetchLocations = async (openModal = false) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/locations`);
      const data: Location[] = await res.json();
      setLocations(data);

      const defaultLoc = data.find((l) => l.is_default);
      if (defaultLoc && !localStorage.getItem(LOCATION_KEY)) {
        localStorage.setItem(LOCATION_KEY, defaultLoc.slug);
        setSelectedSlug(defaultLoc.slug);
      }

      if (openModal) setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch locations", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    if (locations.length === 0) {
      fetchLocations(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const selectLocation = (slug: string) => {
    localStorage.setItem(LOCATION_KEY, slug);
    setSelectedSlug(slug);
    setIsModalOpen(false);
    window.location.reload();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const selectedLocation =
    locations.find((l) => l.slug === selectedSlug) ?? null;

  return {
    locations,
    selectedSlug,
    selectedLocation,
    isModalOpen,
    loading,
    openModal,
    closeModal,
    selectLocation,
  };
}
