"use client";
import React from 'react';
import Navbar from '../components/Navbar';
import TypingGame from '../components/TypingGame';
import Link from 'next/link';

const TypingGamePage = () => {
  return (
    <div>
      <Navbar />
      <div className="pt-24 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Shape Matching Game</h1>
          <Link href="/" className="bg-blue-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors fixed right-4">
            Back
          </Link>
        </div>

        <div className="mb-8">
          <p className="text-gray-700 mb-4">
            Drag each shape to its matching label. Match all 5 shapes to complete the game!
          </p>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h2 className="font-semibold text-lg mb-2 text-black">Instructions:</h2>
            <ul className="list-disc pl-5 space-y-1 text-black">
              <li>Drag shapes from the top area</li>
              <li>Drop each shape on the matching label zone</li>
              <li>Complete all matches to win</li>
              <li>Click "Play Again" to restart</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <TypingGame />
        </div>
      </div>
    </div>
  );
};

export default TypingGamePage;