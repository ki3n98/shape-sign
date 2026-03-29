"use client";
import React, { useRef, useEffect } from "react";
import { useWebcam } from "../hooks/useWebcam";
import { useHandDetection } from "../hooks/useHandDetection";

interface WebcamFeedProps {
  enabled: boolean;
  onLandmarks?: (landmarks: number[]) => void;
}

export default function WebcamFeed({ enabled, onLandmarks }: WebcamFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isReady, error, start, stop } = useWebcam(videoRef);
  const { landmarks, isLoaded } = useHandDetection(videoRef, canvasRef, enabled && isReady);

  useEffect(() => {
    if (enabled) {
      start();
    } else {
      stop();
    }
  }, [enabled, start, stop]);

  useEffect(() => {
    if (landmarks && onLandmarks) {
      onLandmarks(landmarks);
    }
  }, [landmarks, onLandmarks]);

  if (!enabled) return null;

  return (
    <div className="relative w-full max-w-md mx-auto mb-4">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-2">
          {error}
        </div>
      )}
      {!isReady && !error && (
        <div className="bg-gray-200 rounded-lg p-8 text-center text-gray-600">
          Starting camera...
        </div>
      )}
      <div className="relative rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full rounded-lg"
          style={{ transform: "scaleX(-1)" }}
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          style={{ transform: "scaleX(-1)" }}
        />
        {isReady && !isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="text-white text-sm bg-black/50 px-3 py-1 rounded">
              Loading hand detection...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
