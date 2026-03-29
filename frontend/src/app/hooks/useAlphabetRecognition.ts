"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DEBOUNCE_MS = 1000;

export function useAlphabetRecognition() {
  const modelRef = useRef<tf.LayersModel | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const lastPredictionTime = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function loadModel() {
      const model = await tf.loadLayersModel("/models/alphabet_model/model.json");
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

  const predict = useCallback(
    (landmarks: number[]): { letter: string; confidence: number } | null => {
      const model = modelRef.current;
      if (!model || landmarks.length !== 63) return null;

      const now = Date.now();
      if (now - lastPredictionTime.current < DEBOUNCE_MS) return null;
      lastPredictionTime.current = now;

      return tf.tidy(() => {
        const input = tf.tensor2d([landmarks], [1, 63]);
        const output = model.predict(input) as tf.Tensor;
        const probs = output.dataSync();
        const maxIndex = output.argMax(1).dataSync()[0];
        const confidence = probs[maxIndex];

        return { letter: LETTERS[maxIndex], confidence };
      });
    },
    []
  );

  return { predict, isModelLoaded };
}
