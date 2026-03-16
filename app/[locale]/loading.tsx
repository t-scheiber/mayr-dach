export default function Loading() {
  const rows = [2, 3, 4];

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-1">
        {rows.map((count, rowIdx) => (
          <div key={rowIdx} className="flex gap-1">
            {Array.from({ length: count }).map((_, colIdx) => (
              <div
                key={colIdx}
                className="w-3 h-5 bg-primary/50 rounded-b-lg"
                style={{
                  animation: `tile-drop 0.5s ease-out ${rowIdx * 0.12 + colIdx * 0.06}s both, tile-pulse 1.2s ease-in-out ${0.6 + rowIdx * 0.1}s infinite`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
