'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import type { Pin, PinType, PinContent } from '@/lib/types';

export function usePins() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch pins from API
  const fetchPins = useCallback(async () => {
    try {
      const response = await fetch('/api/pins');
      const data = await response.json();
      setPins(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pins');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPins();
    // Poll for updates every 5 seconds (simple alternative to real-time)
    const interval = setInterval(fetchPins, 5000);
    return () => clearInterval(interval);
  }, [fetchPins]);

  // Create a new pin
  const addPin = useCallback(
    async (
      type: PinType,
      content: PinContent,
      position: { x: number; y: number },
      pinColor: string,
      rotation: number = 0
    ) => {
      if (!user) {
        setError('You must be logged in to create a pin');
        return null;
      }

      try {
        const response = await fetch('/api/pins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type,
            content,
            position,
            pinColor,
            rotation,
            authorId: user.id,
            authorName: user.displayName,
            authorPhotoURL: user.photoURL,
          }),
        });

        if (!response.ok) throw new Error('Failed to create pin');

        const newPin = await response.json();
        setPins((prev) => [...prev, newPin]);
        return newPin;
      } catch (err: any) {
        setError(err.message || 'Failed to create pin');
        return null;
      }
    },
    [user]
  );

  // Update pin position
  const movePin = useCallback(
    async (pinId: string, position: { x: number; y: number }) => {
      const pin = pins.find((p) => p.id === pinId);
      if (!pin || pin.authorId !== user?.id) {
        return;
      }

      try {
        // Optimistic update
        setPins((prev) =>
          prev.map((p) => (p.id === pinId ? { ...p, position } : p))
        );

        await fetch('/api/pins', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: pinId, position }),
        });
      } catch (err: any) {
        setError(err.message || 'Failed to move pin');
        fetchPins(); // Revert on error
      }
    },
    [pins, user, fetchPins]
  );

  // Update pin content
  const editPin = useCallback(
    async (pinId: string, content: PinContent) => {
      const pin = pins.find((p) => p.id === pinId);
      if (!pin || pin.authorId !== user?.id) {
        return;
      }

      try {
        await fetch('/api/pins', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: pinId, content }),
        });
        fetchPins();
      } catch (err: any) {
        setError(err.message || 'Failed to update pin');
      }
    },
    [pins, user, fetchPins]
  );

  // Delete a pin
  const removePin = useCallback(
    async (pinId: string) => {
      const pin = pins.find((p) => p.id === pinId);
      if (!pin || pin.authorId !== user?.id) {
        return;
      }

      try {
        // Optimistic update
        setPins((prev) => prev.filter((p) => p.id !== pinId));

        await fetch(`/api/pins?id=${pinId}`, { method: 'DELETE' });
      } catch (err: any) {
        setError(err.message || 'Failed to delete pin');
        fetchPins(); // Revert on error
      }
    },
    [pins, user, fetchPins]
  );

  // Like/unlike a pin
  const likePin = useCallback(
    async (pinId: string) => {
      if (!user) return;

      const pin = pins.find((p) => p.id === pinId);
      if (!pin) return;

      const likes = pin.likes || [];
      const newLikes = likes.includes(user.id)
        ? likes.filter((id) => id !== user.id)
        : [...likes, user.id];

      try {
        // Optimistic update
        setPins((prev) =>
          prev.map((p) => (p.id === pinId ? { ...p, likes: newLikes } : p))
        );

        await fetch('/api/pins', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: pinId, likes: newLikes }),
        });
      } catch (err: any) {
        setError(err.message || 'Failed to like pin');
        fetchPins();
      }
    },
    [user, pins, fetchPins]
  );

  // Check if current user owns a pin
  const isOwner = useCallback(
    (pinId: string) => {
      const pin = pins.find((p) => p.id === pinId);
      return pin?.authorId === user?.id;
    },
    [pins, user]
  );

  return {
    pins,
    loading,
    error,
    addPin,
    movePin,
    editPin,
    removePin,
    likePin,
    isOwner,
    clearError: () => setError(null),
    refresh: fetchPins,
  };
}
