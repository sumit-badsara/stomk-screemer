export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="60" height="60" rx="14" fill="#0E1223" stroke="#334155" strokeWidth="2.5" />
      {/* Upper head block */}
      <path d="M 10 12 C 10 10 14 8 20 10 C 26 12 30 16 30 22 L 30 28 L 10 28 Z" fill="#F8FAFC" />
      {/* Lower jaw block */}
      <path d="M 10 36 L 30 36 L 30 40 C 30 46 24 52 16 52 L 10 52 Z" fill="#F8FAFC" />
      {/* Eye */}
      <circle cx="20" cy="20" r="2.5" fill="#0E1223" />
      {/* Rupee - large */}
      <path d="M 32 28 h 9 M 32 32 h 9 M 34 28 C 38 28 39 35 34 36 L 40 42"
        stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Rupee - small */}
      <path d="M 46 24 h 6 M 46 27 h 6 M 47.5 24 C 50 24 50.5 29 47.5 29.5 L 52 34"
        stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
    </svg>
  );
}
