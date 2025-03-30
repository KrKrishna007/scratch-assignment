import React from "react";

export default function BaseballSprite() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="95"
      height="100"
      viewBox="0 0 95 100"
      version="1.1"
    >
      <circle cx="50" cy="50" r="45" fill="#E0E0E0" />
      <circle cx="50" cy="50" r="40" fill="#FFFFFF" stroke="#888888" strokeWidth="1.5" />
      <path
        d="M 50 10 C 30 10 15 25 10 50 C 10 75 30 90 50 90 C 70 90 85 75 90 50 C 85 25 70 10 50 10"
        fill="none"
        stroke="#FF0000"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 10 50 C 25 55 40 57 50 57 C 60 57 75 55 90 50"
        fill="none"
        stroke="#FF0000"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 10 50 C 25 45 40 43 50 43 C 60 43 75 45 90 50"
        fill="none"
        stroke="#FF0000"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="35" cy="35" r="5" fill="#EFEFEF" stroke="#DDDDDD" strokeWidth="0.5" />
      <circle cx="65" cy="35" r="4" fill="#EFEFEF" stroke="#DDDDDD" strokeWidth="0.5" />
      <circle cx="40" cy="65" r="6" fill="#EFEFEF" stroke="#DDDDDD" strokeWidth="0.5" />
      <circle cx="65" cy="60" r="3" fill="#EFEFEF" stroke="#DDDDDD" strokeWidth="0.5" />
    </svg>
  );
}
