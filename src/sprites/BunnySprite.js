import React from "react";

export default function BunnySprite() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="95"
      height="100"
      viewBox="0 0 95 100"
      version="1.1"
    >
      <ellipse cx="50" cy="65" rx="25" ry="30" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
      <circle cx="50" cy="35" r="20" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
      <ellipse
        cx="35"
        cy="15"
        rx="8"
        ry="20"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="1.5"
        transform="rotate(-15, 35, 15)"
      />
      <ellipse
        cx="65"
        cy="15"
        rx="8"
        ry="20"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="1.5"
        transform="rotate(15, 65, 15)"
      />
      <ellipse cx="35" cy="15" rx="4" ry="12" fill="#FFCCE5" transform="rotate(-15, 35, 15)" />
      <ellipse cx="65" cy="15" rx="4" ry="12" fill="#FFCCE5" transform="rotate(15, 65, 15)" />
      <circle cx="43" cy="32" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
      <circle cx="57" cy="32" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
      <circle cx="43" cy="32" r="2" fill="#000000" />
      <circle cx="57" cy="32" r="2" fill="#000000" />
      <ellipse cx="50" cy="40" rx="3" ry="2" fill="#FFCCE5" stroke="#000000" strokeWidth="0.5" />
      <path d="M 45 45 Q 50 48 55 45" stroke="#000000" strokeWidth="1" fill="none" />
      <line x1="38" y1="40" x2="25" y2="38" stroke="#000000" strokeWidth="0.5" />
      <line x1="38" y1="42" x2="25" y2="42" stroke="#000000" strokeWidth="0.5" />
      <line x1="62" y1="40" x2="75" y2="38" stroke="#000000" strokeWidth="0.5" />
      <line x1="62" y1="42" x2="75" y2="42" stroke="#000000" strokeWidth="0.5" />
      <ellipse cx="35" cy="85" rx="7" ry="5" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
      <ellipse cx="65" cy="85" rx="7" ry="5" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
    </svg>
  );
}
