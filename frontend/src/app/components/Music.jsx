"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import WebcamFeed from "./WebcamFeed";
import { useVolumeGesture } from "../hooks/useVolumeGesture";

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const { getVolume } = useVolumeGesture();

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle spacebar press to toggle music
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        toggleMusic();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPlaying]);

  // Sync volume to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Webcam landmark callback for volume control
  const onLandmarks = useCallback(
    (landmarks) => {
      const vol = getVolume(landmarks);
      setVolume(vol);
    },
    [getVolume]
  );

  return (
    <div className="bg-gray-100 p-4 flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        {/* Camera Toggle */}
        <div className="flex justify-center mb-4">
          <button
            className={`px-3 py-1 rounded-l-lg text-sm font-medium ${
              !useCamera
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setUseCamera(false)}
          >
            Manual
          </button>
          <button
            className={`px-3 py-1 rounded-r-lg text-sm font-medium ${
              useCamera
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setUseCamera(true)}
          >
            Gesture
          </button>
        </div>

        {/* Webcam Feed */}
        <WebcamFeed enabled={useCamera} onLandmarks={onLandmarks} />

        {/* Album Cover */}
        <img
          src="/Carryon.jpg"
          alt="idk - Highvyn, Taylor Shin"
          className="w-64 h-64 mx-auto rounded-lg mb-4 shadow-lg shadow-teal-50"
        />
        {/* Song Title */}
        <h2 className="text-xl font-semibold text-center text-black">
          Carry On
        </h2>
        {/* Artist Name */}
        <p className="text-gray-600 text-sm text-center">
          Anna Yvette, Lost Sky
        </p>
        {/* Music Controls */}
        <div className="mt-6 flex justify-center items-center">
          <button
            className={`p-3 rounded-full focus:outline-none transition-colors duration-300 ${
              isPlaying
                ? "bg-gray-400 hover:bg-gray-500"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
            onClick={toggleMusic}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
        </div>

        {/* Volume Display */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Volume</span>
            <span>{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full"
          />
          {useCamera && (
            <p className="text-xs text-gray-400 text-center mt-1">
              Pinch thumb and index finger to control volume
            </p>
          )}
        </div>

        {/* Audio Element */}
        <audio
          ref={audioRef}
          src="/AnnaYvette,LostSky-CarryOn[NCS Release].mp3"
        />
      </div>
    </div>
  );
}
