export default function LineBreak({ text, n }) {
  const words = text.split(" ");
  const lines = [];

  for (let i = 0; i < words.length; i += n) {
    lines.push(words.slice(i, i + n).join(" "));
  }

  return (
    <>
      {lines.map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </>
  );
}
