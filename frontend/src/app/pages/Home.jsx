import Link from "next/link"

export const Home = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: "url('/background-pattern.svg')",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-sky-100 opacity-90"></div>

      <div className="text-center z-10 px-4">
        <div className="mb-8 flex justify-center">
          <img src="/shapensign1.png" alt="ShapeNSign Logo" className="w-32 h-32 animate-bounce" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="text-black">SHAPE</span>
          <span className="text-blue-500">N</span>
          <span className="text-black">SIGN</span>
        </h1>

        <p className="text-gray-700 text-xl mb-12 max-w-lg mx-auto">
          "Learn, Play, and Grow with Sign Language & Shapes!"
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="#sign-language-display"
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors shadow-lg"
          >
            ASL Learning
          </Link>
          <Link
            href="#music-control-display"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors shadow-lg"
          >
            Music Control
          </Link>
          <Link href="#shape-matching-display" className="btn-primary">
            Shape Matching
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
        <svg
          className="w-10 h-10 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

export default Home
