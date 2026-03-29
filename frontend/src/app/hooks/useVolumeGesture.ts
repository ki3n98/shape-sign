"use client";
import { useRef, useCallback } from "react";

export function useVolumeGesture() {
  const smoothedVolume = useRef(0.5);

  const getVolume = useCallback((landmarks: number[]): number => {
    if (landmarks.length !== 63) return smoothedVolume.current;

    // Thumb tip: landmark 4 (indices 12,13,14)
    // Index tip: landmark 8 (indices 24,25,26)
    const tx = landmarks[12], ty = landmarks[13], tz = landmarks[14];
    const ix = landmarks[24], iy = landmarks[25], iz = landmarks[26];

    const distance = Math.sqrt(
      (tx - ix) ** 2 + (ty - iy) ** 2 + (tz - iz) ** 2
    );

    // Map distance [0.05, 0.3] to volume [0, 1]
    const raw = Math.max(0, Math.min(1, (distance - 0.05) / 0.25));

    // Exponential smoothing
    smoothedVolume.current = smoothedVolume.current * 0.7 + raw * 0.3;

    return smoothedVolume.current;
  }, []);

  return { getVolume };
}
