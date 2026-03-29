"use client"
import { useEffect, useState } from "react";

export default function TypingGame() {
  const [sentence, setSentence] = useState("");
  const [input, setInput] = useState("");
  const [accuracy, setAccuracy] = useState(null);
  const [key, setKey] = useState(0); // State variable to trigger re-render

  useEffect(() => {
    fetch("https://sentence.underthekey.com/language?language=eng&count=20")
      .then((res) => res.json())
      .then((data) => {
        const sentenceList = data.map(item => item.content);
        setSentence(processRandomSentence(sentenceList));
      })
      .catch(() => setSentence("Failed to fetch sentence. Try again later."));
  }, [key]); // Add key as a dependency to re-fetch sentences when key changes

  function processRandomSentence(sentences) {
    if (!sentences || sentences.length === 0) {
      return { original: null, processed: null };
    }
    const randomIndex = Math.floor(Math.random() * sentences.length);
    const originalSentence = sentences[randomIndex];
    const contractions = {
      "it's": "it is",
      "don't": "do not",
      "doesn't": "does not",
      "can't": "cannot",
      "won't": "will not",
      "they're": "they are",
      "i'm": "i am",
      "you're": "you are",
      "we're": "we are",
      "he's": "he is",
      "she's": "she is",
      "that's": "that is",
      "who's": "who is",
      "what's": "what is",
      "where's": "where is",
      "there's": "there is",
      "here's": "here is",
      "wasn't": "was not",
      "weren't": "were not",
      "haven't": "have not",
      "hasn't": "has not",
      "couldn't": "could not",
      "wouldn't": "would not",
      "shouldn't": "should not",
      "aren't": "are not",
      "isn't": "is not",
      "let's": "let us",
      "i've": "i have",
      "you've": "you have",
      "we've": "we have",
      "they've": "they have"
    };
    let processedSentence = originalSentence;
    Object.keys(contractions).forEach(contraction => {
      const regex = new RegExp(contraction, 'gi');
      processedSentence = processedSentence.replace(regex, contractions[contraction]);
    });
    processedSentence = processedSentence.replace(/[^\w\s]/g, '').toLowerCase();
    return processedSentence;
  }

  function calculateAccuracy(input, sentence) {
    const inputWords = input.trim().split(/\s+/);
    const sentenceWords = sentence.trim().split(/\s+/);
    const correctWords = inputWords.filter((word, index) => word === sentenceWords[index]);
    return (correctWords.length / sentenceWords.length) * 100;
  }

  function handleSubmit() {
    const processedInput = input.replace(/[^\w\s]/g, '').toLowerCase();
    const accuracy = calculateAccuracy(processedInput, sentence);
    setAccuracy(accuracy);
  }

  function handleTryAgain() {
    setInput("");
    setAccuracy(null);
    setKey(prevKey => prevKey + 1); // Update key to trigger re-render
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="max-w-2xl p-6 bg-white rounded-lg shadow-lg">
        <p className="mb-4 text-lg font-semibold text-gray-800">{sentence}</p>
        <input
          type="text"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="mt-4 flex justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
        {accuracy !== null && (
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold text-gray-800">Accuracy: {accuracy.toFixed(2)}%</p>
            <button
              className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={handleTryAgain}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}