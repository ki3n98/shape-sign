export default function VideoPlayer({ src }) {
  return (
    <div className="flex flex-col items-center justify-center pb-7">
      <video className="w-full max-w-2xl rounded-lg shadow-lg" controls>
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
