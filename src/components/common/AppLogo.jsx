import React from "react";

export default function AppLogo({ className = "w-9 h-9", size = 36 }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="StatSkill AI Logo"
    >
      <defs>
        {/* Rich Emblem Gradients */}
        <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f2b5c" />
          <stop offset="50%" stopColor="#0b1b36" />
          <stop offset="100%" stopColor="#040b17" />
        </linearGradient>

        <linearGradient id="goldSaffronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffb703" />
          <stop offset="100%" stopColor="#fb8500" />
        </linearGradient>

        <linearGradient id="cyanAiGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#a5f3fc" />
        </linearGradient>

        <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        {/* Glow Filter */}
        <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
      </defs>

      {/* Rounded Squircle Container */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="12"
        fill="url(#logoBgGrad)"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="1.5"
      />

      {/* Tricolor Precision Corner Accent Rims */}
      <path
        d="M 14 3 Q 3 3 3 14"
        stroke="url(#goldSaffronGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 34 45 Q 45 45 45 34"
        stroke="url(#emeraldGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* 4 Ascending Statistical Cadre Intelligence Bars */}
      {/* Bar 1 */}
      <rect
        x="10"
        y="27"
        width="4.5"
        height="11"
        rx="2"
        fill="url(#cyanAiGrad)"
        opacity="0.75"
      />
      {/* Bar 2 */}
      <rect
        x="17"
        y="21"
        width="4.5"
        height="17"
        rx="2"
        fill="url(#cyanAiGrad)"
        opacity="0.9"
      />
      {/* Bar 3 */}
      <rect
        x="24"
        y="15"
        width="4.5"
        height="23"
        rx="2"
        fill="url(#cyanAiGrad)"
      />
      {/* Bar 4: Breakthrough Bar */}
      <rect
        x="31"
        y="10"
        width="4.5"
        height="28"
        rx="2"
        fill="url(#goldSaffronGrad)"
        filter="url(#logoGlow)"
      />

      {/* AI Neural Nexus Trajectory Curve */}
      <path
        d="M 12 26 C 18 20, 24 14, 33 9.5"
        stroke="url(#goldSaffronGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1 3"
      />

      {/* Dynamic 8-Point AI Intelligence Star at Summit */}
      <g transform="translate(33.25, 9.5)">
        <circle r="3.5" fill="#ffffff" filter="url(#logoGlow)" />
        <circle r="2" fill="#fb8500" />
        <path
          d="M 0 -5.5 L 0 5.5 M -5.5 0 L 5.5 0"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </g>

      {/* Central Statistical Core Indicator */}
      <circle cx="26.25" cy="15" r="1.5" fill="#ffffff" />
      <circle cx="19.25" cy="21" r="1.5" fill="#ffffff" opacity="0.9" />
    </svg>
  );
}
