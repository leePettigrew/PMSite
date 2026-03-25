import { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";

const easeOut = [0.16, 1, 0.3, 1];

function FracturedWord({
  text,
  boxX,
  boxY,
  boxW,
  boxH,
  fontSize,
  fontWeight,
  pieces,
  tint = "#e8efff",
  hoverEnabled = true,
  letterSpacing = "0em",
}) {
  const [hovered, setHovered] = useState(false);
  const uid = useId().replace(/:/g, "");

  const maskId = `mask-${uid}`;
  const fillId = `fill-${uid}`;
  const sheenId = `sheen-${uid}`;
  const glowId = `glow-${uid}`;

  return (
    <g
      transform={`translate(${boxX} ${boxY})`}
      onMouseEnter={() => hoverEnabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ pointerEvents: "auto" }}
    >
      <defs>
        <linearGradient id={fillId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.96" />
          <stop offset="38%" stopColor={tint} stopOpacity="0.92" />
          <stop offset="100%" stopColor="#b9c9f0" stopOpacity="0.78" />
        </linearGradient>

        <linearGradient id={sheenId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="28%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
        </linearGradient>

        <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 0.2 0
            "
          />
        </filter>

        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect width={boxW} height={boxH} fill="black" />
          <text
            x={boxW / 2}
            y={boxH / 2}
            fill="white"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={fontSize}
            fontWeight={fontWeight}
            letterSpacing={letterSpacing}
            fontFamily="Inter, system-ui, -apple-system, Segoe UI, Arial, sans-serif"
          >
            {text}
          </text>
        </mask>
      </defs>

      <g filter={`url(#${glowId})`} mask={`url(#${maskId})`}>
        <rect x="0" y="0" width={boxW} height={boxH} fill={tint} opacity="0.08" />
      </g>

      <g mask={`url(#${maskId})`}>
        {pieces.map((piece, i) => (
          <motion.g
            key={i}
            initial={{
              x: piece.fromX,
              y: piece.fromY,
              rotate: piece.fromR,
              opacity: 0,
              scale: 0.97,
            }}
            animate={{
              x: hovered ? piece.hoverX : 0,
              y: hovered ? piece.hoverY : 0,
              rotate: hovered ? piece.hoverR : 0,
              opacity: 1,
              scale: 1,
            }}
            transition={{
              opacity: { duration: 0.55, delay: piece.delay },
              scale: { duration: 1.5, delay: piece.delay, ease: easeOut },
              x: {
                duration: hovered ? 0.55 : 1.75,
                delay: hovered ? 0 : piece.delay,
                ease: easeOut,
              },
              y: {
                duration: hovered ? 0.55 : 1.75,
                delay: hovered ? 0 : piece.delay,
                ease: easeOut,
              },
              rotate: {
                duration: hovered ? 0.55 : 1.75,
                delay: hovered ? 0 : piece.delay,
                ease: easeOut,
              },
            }}
            style={{
              transformBox: "fill-box",
              transformOrigin: "50% 50%",
            }}
          >
            <polygon
              points={piece.points}
              fill={`url(#${fillId})`}
              stroke="white"
              strokeOpacity="0.17"
              strokeWidth="1.15"
            />
            <polygon
              points={piece.points}
              fill={`url(#${sheenId})`}
              opacity="0.5"
            />
          </motion.g>
        ))}

        <text
          x={boxW / 2}
          y={boxH / 2}
          fill="none"
          stroke="white"
          strokeOpacity="0.08"
          strokeWidth="2"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          fontWeight={fontWeight}
          letterSpacing={letterSpacing}
          fontFamily="Inter, system-ui, -apple-system, Segoe UI, Arial, sans-serif"
        >
          {text}
        </text>
      </g>
    </g>
  );
}

export default function LogoAssembler() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  const pmPieces = [
    {
      points: "0,0 250,0 182,112 0,146",
      fromX: -160,
      fromY: -60,
      fromR: -14,
      hoverX: -26,
      hoverY: -10,
      hoverR: -4,
      delay: 0.02,
    },
    {
      points: "0,146 182,112 208,280 0,280",
      fromX: -150,
      fromY: 74,
      fromR: 10,
      hoverX: -20,
      hoverY: 14,
      hoverR: 3,
      delay: 0.1,
    },
    {
      points: "250,0 356,0 304,132 182,112",
      fromX: -38,
      fromY: -128,
      fromR: 9,
      hoverX: -8,
      hoverY: -12,
      hoverR: 2,
      delay: 0.16,
    },
    {
      points: "182,112 304,132 294,280 208,280",
      fromX: -24,
      fromY: 116,
      fromR: -8,
      hoverX: -6,
      hoverY: 12,
      hoverR: -2,
      delay: 0.24,
    },
    {
      points: "356,0 540,0 472,120 304,132",
      fromX: 136,
      fromY: -78,
      fromR: 15,
      hoverX: 22,
      hoverY: -10,
      hoverR: 4,
      delay: 0.32,
    },
    {
      points: "304,132 472,120 540,280 294,280",
      fromX: 146,
      fromY: 84,
      fromR: -10,
      hoverX: 18,
      hoverY: 14,
      hoverR: -3,
      delay: 0.4,
    },
  ];

  const solutionsPieces = [
    {
      points: "0,0 168,0 126,82 0,112",
      fromX: -120,
      fromY: -44,
      fromR: -8,
      hoverX: -16,
      hoverY: -6,
      hoverR: -2,
      delay: 0.08,
    },
    {
      points: "0,112 126,82 192,190 0,190",
      fromX: -118,
      fromY: 42,
      fromR: 7,
      hoverX: -14,
      hoverY: 10,
      hoverR: 2,
      delay: 0.14,
    },
    {
      points: "168,0 362,0 300,78 126,82",
      fromX: -52,
      fromY: -58,
      fromR: 6,
      hoverX: -8,
      hoverY: -8,
      hoverR: 2,
      delay: 0.2,
    },
    {
      points: "126,82 300,78 370,190 192,190",
      fromX: -42,
      fromY: 50,
      fromR: -6,
      hoverX: -6,
      hoverY: 9,
      hoverR: -2,
      delay: 0.26,
    },
    {
      points: "362,0 598,0 520,98 300,78",
      fromX: 0,
      fromY: -68,
      fromR: 7,
      hoverX: 0,
      hoverY: -8,
      hoverR: 2,
      delay: 0.32,
    },
    {
      points: "300,78 520,98 620,190 370,190",
      fromX: 0,
      fromY: 56,
      fromR: -6,
      hoverX: 0,
      hoverY: 9,
      hoverR: -2,
      delay: 0.38,
    },
    {
      points: "598,0 790,0 728,82 520,98",
      fromX: 58,
      fromY: -54,
      fromR: 7,
      hoverX: 8,
      hoverY: -8,
      hoverR: 2,
      delay: 0.44,
    },
    {
      points: "520,98 728,82 826,190 620,190",
      fromX: 56,
      fromY: 48,
      fromR: -6,
      hoverX: 6,
      hoverY: 8,
      hoverR: -2,
      delay: 0.5,
    },
    {
      points: "790,0 980,0 980,96 728,82",
      fromX: 124,
      fromY: -40,
      fromR: 8,
      hoverX: 16,
      hoverY: -6,
      hoverR: 2,
      delay: 0.56,
    },
    {
      points: "728,82 980,96 980,190 826,190",
      fromX: 122,
      fromY: 42,
      fromR: -7,
      hoverX: 14,
      hoverY: 8,
      hoverR: -2,
      delay: 0.62,
    },
  ];

  return (
    <div className="absolute inset-0">
      <svg
        viewBox="0 0 1600 900"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="bgGlowTop" cx="50%" cy="24%" r="58%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.16)" />
            <stop offset="55%" stopColor="rgba(125,145,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>

          <linearGradient id="bgFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(5,7,11,0)" />
            <stop offset="100%" stopColor="rgba(5,7,11,0.96)" />
          </linearGradient>
        </defs>

        <rect width="1600" height="900" fill="#05070b" />
        <rect width="1600" height="900" fill="url(#bgGlowTop)" />
        <rect width="1600" height="900" fill="url(#bgFade)" />

        {/* Entire logo group centered */}
        <g transform="translate(72 310)">
          <FracturedWord
            text="PM"
            boxX={0}
            boxY={0}
            boxW={540}
            boxH={280}
            fontSize={252}
            fontWeight={900}
            pieces={pmPieces}
            tint="#eef3ff"
            hoverEnabled={!isTouch}
          />

          <FracturedWord
            text="SOLUTIONS"
            boxX={470}
            boxY={38}
            boxW={980}
            boxH={190}
            fontSize={164}
            fontWeight={800}
            pieces={solutionsPieces}
            tint="#dfe8ff"
            hoverEnabled={!isTouch}
            letterSpacing="0.01em"
          />
        </g>
      </svg>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.10),transparent_54%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_58%_35%,rgba(120,140,255,0.10),transparent_58%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,7,11,0.0),rgba(5,7,11,0.96))]" />
      </div>
    </div>
  );
}