export default function HeroSlogan({ text }: { text: string }) {
  return (
    <h1
      className="hero-slogan inline-block font-handwriting font-normal tracking-wide text-white leading-[1.1] drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] whitespace-nowrap"
      style={{ fontSize: "clamp(1.2rem, 5.5vw, 6.5rem)", maxWidth: "90vw" }}
    >
      {text}
    </h1>
  );
}
