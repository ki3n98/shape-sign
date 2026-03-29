export default function Card({ imgSrc, title, description }) {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white mb-4">
      <img className="w-full" src={imgSrc} alt={title} />
      <div className="px-6 py-4">
        <h2 className="font-bold text-xl text-black mb-2">{title}</h2>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
    </div>
  );
}
