export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <rect
        x="1.5"
        y="1.5"
        width="29"
        height="29"
        rx="8"
        fill="#FFD43B"
        stroke="#1a1a1a"
        strokeWidth="3"
      />
      {/* Uptrend line */}
      <path
        d="M7 22L13 16L17 19L25 10"
        stroke="#16a34a"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arrow head */}
      <path
        d="M21 10H25V14"
        stroke="#16a34a"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Magnifying glass */}
      <circle
        cx="21"
        cy="21"
        r="5"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        fill="#fffdf5"
        opacity="0.9"
      />
      <line
        x1="24.5"
        y1="24.5"
        x2="28"
        y2="28"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
