"use client";
import { useState, useEffect } from "react";
// import ShapeMatchingGame from "./components/ShapeMatchingGame";
import MusicDisplay from "./pages/MusicDisplay";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Home from "./pages/Home";
import ShapeMatchingDisplay from "./pages/ShapeMatchingDisplay";
import SignLanguageDisplay from "./pages/SignLanguageDisplay";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Ensure any client-only logic is handled here
  useEffect(() => {
    // Example: Any client-side setup can go here
  }, []);

  return (
    <div>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="pt-24">
        <Home />
        <About />
        <SignLanguageDisplay />
        <MusicDisplay />
        <ShapeMatchingDisplay />
      </div>
    </div>
  );
}