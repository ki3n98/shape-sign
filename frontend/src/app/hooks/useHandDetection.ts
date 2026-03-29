"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  HandLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

export function useHandDetection(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  enabled: boolean
) {
  const [landmarks, setLandmarks] = useState<number[] | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(-1);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    async function init() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      if (cancelled) return;

      const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 1,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      if (cancelled) {
        handLandmarker.close();
        return;
      }

      handLandmarkerRef.current = handLandmarker;
      setIsLoaded(true);
    }

    init();

    return () => {
      cancelled = true;
      if (handLandmarkerRef.current) {
        handLandmarkerRef.current.close();
        handLandmarkerRef.current = null;
      }
      setIsLoaded(false);
    };
  }, [enabled]);

  const detect = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const handLandmarker = handLandmarkerRef.current;

    if (!video || !handLandmarker || video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(detect);
      return;
    }

    const now = performance.now();
    if (now === lastTimeRef.current) {
      animFrameRef.current = requestAnimationFrame(detect);
      return;
    }
    lastTimeRef.current = now;

    const results = handLandmarker.detectForVideo(video, now);

    // Draw landmarks on canvas
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (results.landmarks && results.landmarks.length > 0) {
          const drawingUtils = new DrawingUtils(ctx);
          for (const hand of results.landmarks) {
            drawingUtils.drawConnectors(
              hand,
              HandLandmarker.HAND_CONNECTIONS,
              { color: "#00FF00", lineWidth: 2 }
            );
            drawingUtils.drawLandmarks(hand, {
              color: "#FF0000",
              lineWidth: 1,
              radius: 3,
            });
          }
        }
      }
    }

    // Extract flat landmark array (63 floats)
    if (results.landmarks && results.landmarks.length > 0) {
      const flat = results.landmarks[0].flatMap((lm) => [lm.x, lm.y, lm.z]);
      setLandmarks(flat);
    } else {
      setLandmarks(null);
    }

    animFrameRef.current = requestAnimationFrame(detect);
  }, [videoRef, canvasRef]);

  useEffect(() => {
    if (enabled && isLoaded) {
      animFrameRef.current = requestAnimationFrame(detect);
    }
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [enabled, isLoaded, detect]);

  return { landmarks, isLoaded };
}
