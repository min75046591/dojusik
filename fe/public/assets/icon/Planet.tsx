import React from "react";

interface PlanetProps {
  size?: "small" | "big";
}

export default function Planet({ size = "small" }: PlanetProps) {
  return size === "small" ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="37" viewBox="0 0 64 37" fill="none">
      <circle cx="32.5" cy="18.0303" r="15" fill="#0ABAB5" />
      <path d="M43.5305 8.09121L58.5 0.530274" stroke="black" />
      <path d="M58.5 0.530273L62.7775 2.61599" stroke="black" />
      <path d="M63 3.03027L62.5 9.53027" stroke="black" />
      <path d="M62.7025 9.48831L50.5 18.0303L36.4999 24.53L22.5 30.5303L7 33.5303" stroke="black" />
      <path d="M7.31156 33.4955L1.49987 31.5306" stroke="black" />
      <path d="M1 31.5303L4.01436 25.3498" stroke="black" />
      <path d="M3.91051 25.3481L17.5275 19.0191" stroke="black" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="168" height="98" viewBox="0 0 168 98" fill="none">
      <circle cx="84.459" cy="47.7705" r="39.7422" fill="#0ABAB5" />
      <path d="M113.683 21.4378L153.345 1.40526" stroke="black" />
      <path d="M153.346 1.40495L164.679 6.931" stroke="black" />
      <path d="M165.268 8.02832L163.943 25.2499" stroke="black" />
      <path d="M164.48 25.1387L132.15 47.7704L95.0566 64.9913L57.9642 80.8889L16.8973 88.8374" stroke="black" />
      <path d="M17.7222 88.7457L2.32428 83.5397" stroke="black" />
      <path d="M1 83.5391L8.98649 67.164" stroke="black" />
      <path d="M8.71118 67.1594L44.7892 50.391" stroke="black" />
    </svg>
  );
}
