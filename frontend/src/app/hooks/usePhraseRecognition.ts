"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";

const PHRASES = [
  "I", "I Love You", "Yes", "can", "drink", "eat", "good", "help",
  "hungry", "morning", "my", "name", "no", "please", "sorry",
  "thanks", "thirsty", "yes", "you", "you're welcome",
];

const FRAME_COUNT = 60;
const CONFIDENCE_THRESHOLD = 0.85;

export function usePhraseRecognition() {
  const modelRef = useRef<tf.LayersModel | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const frameBuffer = useRef<number[][]>([]);
  const [frameProgress, setFrameProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadModel() {
      const model = await tf.loadLayersModel("/models/phrases_model/model.json");
      if (!cancelled) {
        modelRef.current = model;
        setIsModelLoaded(true);
      }
    }

    loadModel();

    return () => {
      cancelled = true;
      if (modelRef.current) {
        modelRef.current.dispose();
        modelRef.current = null;
      }
    };
  }, []);

  const addFrame = useCallback(
    (landmarks: number[]): { phrase: string; confidence: number } | null => {
      const model = modelRef.current;
      if (!model) return null;

      // Pad or truncate to 63 values
      const frame = landmarks.slice(0, 63);
      while (frame.length < 63) frame.push(0);

      frameBuffer.current.push(frame);
      setFrameProgress(frameBuffer.current.length);

      if (frameBuffer.current.length < FRAME_COUNT) return null;

      // Run prediction on collected frames
      const frames = frameBuffer.current.slice(0, FRAME_COUNT);
      frameBuffer.current = [];
      setFrameProgress(0);

      const input = tf.tensor3d([frames], [1, FRAME_COUNT, 63]);
      const output = model.predict(input) as tf.Tensor;
      const probs = output.dataSync();
      const maxIndex = output.argMax(1).dataSync()[0];
      const confidence = probs[maxIndex];
      input.dispose();
      output.dispose();

      if (confidence >= CONFIDENCE_THRESHOLD) {
        return { phrase: PHRASES[maxIndex], confidence };
      }
      return null;
    },
    []
  );

  const reset = useCallback(() => {
    frameBuffer.current = [];
    setFrameProgress(0);
  }, []);

  return { addFrame, reset, isModelLoaded, frameProgress, totalFrames: FRAME_COUNT };
}
