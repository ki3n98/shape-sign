"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import WebcamFeed from "./WebcamFeed";
import { useAlphabetRecognition } from "../hooks/useAlphabetRecognition";

export default function Alphabet() {
  const [sentence, setSentence] = useState("");
  const [score, setScore] = useState(0);
  const [useCamera, setUseCamera] = useState(true);
  const [predictedLetter, setPredictedLetter] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const { predict, isModelLoaded } = useAlphabetRecognition();
  const sentenceRef = useRef(sentence);
  const isAnimating = useRef(false);

  const items = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function getRandomItem() {
    return items[Math.floor(Math.random() * items.length)];
  }

  function handleNextLetter() {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setScore((prevScore) => prevScore + 1);
    setShowCorrect(true);
    setTimeout(() => {
      setShowCorrect(false);
      setSentence(getRandomItem());
      isAnimating.current = false;
    }, 1200);
  }

  function handleStartOver() {
    setScore(0);
    setSentence(getRandomItem());
    setPredictedLetter(null);
  }

  useEffect(() => {
    setSentence(getRandomItem());
  }, []);

  useEffect(() => {
    sentenceRef.current = sentence;
  }, [sentence]);

  // Keyboard input (fallback)
  useEffect(() => {
    if (useCamera) return;

    const handleKeyPress = (e) => {
      if (e.key.toUpperCase() === sentenceRef.current) {
        handleNextLetter();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [useCamera]);

  // Webcam landmark callback
  const onLandmarks = useCallback(
    (landmarks) => {
      const result = predict(landmarks);
      if (!result) return;

      setPredictedLetter(result.letter);
      if (result.confidence > 0.7 && result.letter === sentenceRef.current) {
        handleNextLetter();
      }
    },
    [predict]
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
            Loading alphabet model...
          </p>
        )}

        {/* Predicted letter feedback */}
        {useCamera && predictedLetter && (
          <p className="text-center text-lg text-gray-600 mb-2">
            You signed: <span className="font-bold text-2xl">{predictedLetter}</span>
          </p>
        )}

        <p className="mb-4 text-4xl text-center font-semibold text-gray-800">
          Score: {score}
        </p>

        {/* Letter display with correct flash */}
        <div
          className={`mb-4 py-6 rounded-xl transition-all duration-300 ${
            showCorrect
              ? "bg-green-100 border-4 border-green-500 scale-110"
              : "bg-transparent border-4 border-transparent"
          }`}
        >
          {showCorrect && (
            <p className="text-center text-green-600 text-3xl font-bold animate-bounce">
              Correct!
            </p>
          )}
          <p
            className={`text-8xl text-center font-semibold transition-colors duration-300 ${
              showCorrect ? "text-green-600" : "text-gray-800"
            }`}
          >
            {sentence}
          </p>
        </div>
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
