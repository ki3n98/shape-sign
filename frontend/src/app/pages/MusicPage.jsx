"use client";
import React from 'react';
import Navbar from '../components/Navbar';
import Music from '../components/Music';
import Link from 'next/link';
import VideoPlayer from '../components/VideoPlayer';
import Card from '../components/Card';
import Footer from '../components/Footer';

const MusicPage = () => {
  return (
    <div>
      <div className="pt-24 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Music Control</h1>
          <Link href="/" className="bg-blue-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors fixed right-4">
            Back
          </Link>
        </div>
        <VideoPlayer src="/volume_control.mp4" />
        <div className="flex space-x-4 mb-8">
                  <Card
                    imgSrc="/volumn_up.png"
                    title="Volumn Up"
                    description="Hand gesture for volumn up"
                  />
                  <Card
                    imgSrc="/volumn_down.png"
                    title="Volumn Down"
                    description="Hand gesture for volumn down"
                  />
                </div>
        <div className="mb-8">
          <p className="text-gray-700 mb-4">
            Use your hand gesture to control the music player.
          </p>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h2 className="font-semibold text-lg mb-2 text-black">Instructions:</h2>
            <ul className="list-disc pl-5 space-y-1 text-black">
              <li>Move your index finger upward to volumn up</li>
              <li>Move your index finger downward to volumn down</li>
              <li>Press Space to Play/Pause or Click on the Play/Pause Button</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <Music  />
        </div>
      </div>
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default MusicPage;