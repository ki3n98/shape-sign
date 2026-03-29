"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import WebcamFeed from "./WebcamFeed";
import { usePhraseRecognition } from "../hooks/usePhraseRecognition";

export default function Phrases() {
  const [word, setWord] = useState("");
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [key, setKey] = useState(0);
  const [useCamera, setUseCamera] = useState(true);
  const [predictedPhrase, setPredictedPhrase] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const { addFrame, reset, isModelLoaded, frameProgress, totalFrames } =
    usePhraseRecognition();
  const wordRef = useRef(word);

  const items = [
    "I", "I Love You", "Yes", "can", "drink", "eat", "good", "help",
    "hungry", "morning", "my", "name", "no", "please", "sorry",
    "thanks", "thirsty", "yes", "you", "you're welcome",
  ];

  function getRandomWord() {
    return items[Math.floor(Math.random() * items.length)];
  }

  function handleNextPhrase() {
    setScore((prevScore) => prevScore + 1);
    setShowCorrect(true);
    setTimeout(() => setShowCorrect(false), 500);
    setKey((prevKey) => prevKey + 1);
  }

  function handleStartOver() {
    setScore(0);
    setKey((prevKey) => prevKey + 1);
    setPredictedPhrase(null);
    reset();
  }

  useEffect(() => {
    setWord(getRandomWord());
    setInput("");
    reset();
  }, [key]);

  useEffect(() => {
    wordRef.current = word;
  }, [word]);

  // Text input matching (fallback)
  useEffect(() => {
    if (useCamera) return;
    const trimmedInput = input.trim().toLowerCase();
    if (trimmedInput === "") return;

    if (trimmedInput === word.toLowerCase()) {
      handleNextPhrase();
    } else {
      setInput("");
    }
  }, [input, useCamera]);

  // Webcam landmark callback
  const onLandmarks = useCallback(
    (landmarks) => {
      const result = addFrame(landmarks);
      if (!result) return;

      setPredictedPhrase(result.phrase);
      if (result.phrase.toLowerCase() === wordRef.current.toLowerCase()) {
        handleNextPhrase();
      }
    },
    [addFrame]
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="max-w-2xl w-full p-6 bg-white rounded-lg shadow-lg">
        {/* Camera Toggle */}
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 rounded-l-lg text-sm font-medium ${
              !useCamera
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setUseCamera(false)}
          >
            Keyboard
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg text-sm font-medium ${
              useCamera
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setUseCamera(true)}
          >
            Webcam
          </button>
        </div>

        {/* Webcam Feed */}
        <WebcamFeed enabled={useCamera} onLandmarks={onLandmarks} />

        {useCamera && !isModelLoaded && (
          <p className="text-center text-gray-500 text-sm mb-2">
            Loading phrase model...
          </p>
        )}

        {/* Frame progress bar */}
        {useCamera && isModelLoaded && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Recording gesture...</span>
              <span>{frameProgress}/{totalFrames} frames</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${(frameProgress / totalFrames) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Predicted phrase feedback */}
        {useCamera && predictedPhrase && (
          <p className="text-center text-lg text-gray-600 mb-2">
            Detected: <span className="font-bold text-xl">{predictedPhrase}</span>
          </p>
        )}

        {/* Correct animation */}
        {showCorrect && (
          <p className="text-center text-green-500 text-xl font-bold mb-2">
            Correct!
          </p>
        )}

        <p className="mb-4 text-4xl text-center font-semibold text-gray-800">
          Score: {score}
        </p>
        <p className="mb-4 text-5xl text-center font-semibold text-gray-800">
          {word}
        </p>

        {/* Text input (fallback mode) */}
        {!useCamera && (
          <input
            key={key}
            type="text"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        )}

        <div className="mt-4 text-center">
          <button
            className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={handleStartOver}
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
