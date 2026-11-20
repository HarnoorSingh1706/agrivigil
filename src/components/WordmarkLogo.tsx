import React from "react";
import Link from "next/link";

interface WordmarkLogoProps {
  className?: string;
  showTagline?: boolean;
}

export const WordmarkLogo: React.FC<WordmarkLogoProps> = ({ className = "", showTagline = false }) => {
  return (
    <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
      {/* Modern High-End Bio-Acoustic Emblem */}
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950 text-white flex items-center justify-center shadow-md shadow-emerald-900/20 group-hover:shadow-emerald-900/30 transition-all border border-emerald-700/50">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-amber-400"
          >
            {/* Elegant Leaf Contour */}
            <path
              d="M7 25C7 25 8.5 15 16 9.5C23.5 4 26 5 26 5C26 5 27 7.5 21.5 15C16 22.5 7 25 7 25Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 25C13 20 17 16 22 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Bio-Acoustic Wave Arcs */}
            <path
              d="M17 10C18.5 11 20 13.5 19.5 16"
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M20 7.5C22.5 9 24.5 13 23.5 17"
              stroke="#34d399"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-400" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-emerald-950">
            Agri<span className="text-emerald-700 font-extrabold">Vigil</span>
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
            R&D Pilot
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-stone-500 font-medium tracking-tight">
            Know your field. Act at the right time.
          </span>
        )}
      </div>
    </Link>
  );
};
