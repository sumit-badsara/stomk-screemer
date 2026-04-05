"use client";

import Image from "next/image";

const logos = [
  { file: "/logos/v1-chart-profile.svg", name: "V1 — Chart Line Profile", desc: "Stock chart line morphs into face silhouette. Dual-read: data + person." },
  { file: "/logos/v2-negative-space.svg", name: "V2 — Negative Space", desc: "Cream face carved from dark bg. Premium, high contrast, editorial feel." },
  { file: "/logos/v3-split-scream.svg", name: "V3 — Split Scream", desc: "Two geometric jaw blocks, rupees burst through the gap. Bold, abstract." },
  { file: "/logos/v4-coin-profile.svg", name: "V4 — Coin Badge", desc: "Profile minted inside a coin. Fintech authority, currency metaphor." },
  { file: "/logos/v5-bold-profile.svg", name: "V5 — Bold Profile", desc: "Thick filled silhouette with knocked-out eye + mouth. Confident, iconic." },
  { file: "/logos/v6-dark-lettermark.svg", name: "V6 — S Lettermark", desc: "Gold S on dark that reads as a profile. Premium, moody, abstract." },
];

export default function LogoPreview() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">StomkScreemer Logo Options</h1>
      <p className="text-sm text-fg/60 font-semibold mb-8">
        Minimalist screaming profile + rupee. Neo-brutalist. Click to compare.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {logos.map(({ file, name, desc }) => (
          <div key={name} className="panel p-6 bg-cream flex flex-col items-center gap-5">
            {/* Large preview */}
            <div className="bg-bg p-5 rounded-xl flex items-center justify-center">
              <Image src={file} alt={name} width={140} height={140} />
            </div>

            {/* Header preview — how it looks in the nav */}
            <div className="flex items-center gap-2.5 bg-bg border-[3px] border-fg rounded-xl px-4 py-2 w-full justify-center">
              <Image src={file} alt={name} width={30} height={30} />
              <span className="text-base font-bold">
                Stomk<span className="text-green-dark">Screemer</span>
              </span>
            </div>

            {/* Favicon strip — 16 / 24 / 32 px */}
            <div className="flex items-center gap-4">
              {[16, 24, 32].map((s) => (
                <div
                  key={s}
                  className="bg-bg p-1 rounded border-2 border-fg/20 flex items-center justify-center"
                >
                  <Image src={file} alt={`${s}px`} width={s} height={s} />
                </div>
              ))}
              <span className="text-[10px] text-fg/40 font-bold">
                16 / 24 / 32px
              </span>
            </div>

            {/* Dark bg preview */}
            <div className="flex items-center gap-2.5 bg-fg rounded-xl px-4 py-2 w-full justify-center">
              <Image src={file} alt={name} width={30} height={30} />
              <span className="text-base font-bold text-cream">
                Stomk<span className="text-green-dark">Screemer</span>
              </span>
            </div>

            {/* Label */}
            <div className="text-center">
              <p className="text-sm font-bold">{name}</p>
              <p className="text-xs text-fg/50 font-semibold mt-0.5">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
