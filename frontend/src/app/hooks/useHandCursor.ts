"use client";
import { useRef, useState, useCallback } from "react";

interface HandCursorState {
  x: number;
  y: number;
  isGrabbing: boolean;
  justGrabbed: string | null;   // shape id grabbed this frame
  justDropped: { shapeId: string; zoneId: string } | null; // drop event
}

export function useHandCursor(
  containerRef: React.RefObject<HTMLElement | null>,
  shapeElements: React.MutableRefObject<Map<string, HTMLElement>>,
  zoneElements: React.MutableRefObject<Map<string, HTMLElement>>
) {
  const [cursor, setCursor] = useState<HandCursorState>({
    x: 0, y: 0, isGrabbing: false, justGrabbed: null, justDropped: null,
  });
  const wasGrabbing = useRef(false);
  const smoothX = useRef(0);
  const smoothY = useRef(0);
  const heldShape = useRef<string | null>(null);

  const update = useCallback(
    (landmarks: number[]) => {
      if (!containerRef.current || landmarks.length !== 63) return;

      const rect = containerRef.current.getBoundingClientRect();

      // Index finger tip: landmark 8 (indices 24,25,26)
      // Remap so hand at 20%-80% of frame covers the full game area
      const MARGIN = 0.2;
      const rawX = Math.max(0, Math.min(1, (1 - landmarks[24] - MARGIN) / (1 - 2 * MARGIN)));
      const rawY = Math.max(0, Math.min(1, (landmarks[25] - MARGIN) / (1 - 2 * MARGIN)));

      const targetX = rect.left + rawX * rect.width;
      const targetY = rect.top + rawY * rect.height;

      smoothX.current = smoothX.current * 0.6 + targetX * 0.4;
      smoothY.current = smoothY.current * 0.6 + targetY * 0.4;

      // Grab detection: thumb extended = clicking/grabbing
      // Neutral: only index finger out (thumb tucked)
      // Grab: both index and thumb extended
      // Measure thumb tip (4) to index finger MCP (5) distance
      const thumbTipX = landmarks[12], thumbTipY = landmarks[13], thumbTipZ = landmarks[14];
      const indexMcpX = landmarks[15], indexMcpY = landmarks[16], indexMcpZ = landmarks[17];
      const thumbDist = Math.sqrt(
        (thumbTipX - indexMcpX) ** 2 + (thumbTipY - indexMcpY) ** 2 + (thumbTipZ - indexMcpZ) ** 2
      );
      const isGrabbing = thumbDist > 0.12;

      const x = smoothX.current;
      const y = smoothY.current;

      let justGrabbed: string | null = null;
      let justDropped: { shapeId: string; zoneId: string } | null = null;

      if (isGrabbing && !wasGrabbing.current) {
        // Pinch started — check if cursor is over a shape
        for (const [id, el] of shapeElements.current.entries()) {
          const r = el.getBoundingClientRect();
          if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
            heldShape.current = id;
            justGrabbed = id;
            break;
          }
        }
      } else if (!isGrabbing && wasGrabbing.current && heldShape.current) {
        // Pinch released — check if cursor is over a drop zone
        for (const [id, el] of zoneElements.current.entries()) {
          const r = el.getBoundingClientRect();
          if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
            justDropped = { shapeId: heldShape.current, zoneId: id };
            break;
          }
        }
        heldShape.current = null;
      }

      wasGrabbing.current = isGrabbing;
      setCursor({
        x, y, isGrabbing,
        justGrabbed,
        justDropped,
      });
    },
    [containerRef, shapeElements, zoneElements]
  );

  return { cursor, update, heldShape: heldShape.current };
}
