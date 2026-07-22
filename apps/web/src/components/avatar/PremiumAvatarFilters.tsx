import { getFitzpatrickCurves } from "@/lib/avatar2d-utils";

type PremiumAvatarFiltersProps = {
  skinTone?: string;
};

export function PremiumAvatarFilters({ skinTone = "#C68642" }: PremiumAvatarFiltersProps) {
  const { rTable, gTable, bTable } = getFitzpatrickCurves(skinTone);

  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes avatar-breathe {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(-2px) scaleY(1.008); }
        }
        @keyframes avatar-idle-posture {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(-0.2deg); }
          34% { transform: translate3d(1px, -1px, 0) rotate(0.35deg); }
          68% { transform: translate3d(-1px, 0, 0) rotate(0.1deg); }
        }
        @keyframes avatar-blink {
          0%, 43%, 45%, 76%, 78%, 100% { transform: scaleY(1); }
          44%, 77% { transform: scaleY(0.08); }
        }
        @keyframes avatar-frame-signal {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.85; }
        }
        .avatar-idle-posture {
          animation: avatar-idle-posture 10.5s ease-in-out infinite;
          transform-origin: 50% 78%;
          will-change: transform;
        }
        .avatar-idle-breathe {
          animation: avatar-breathe 4.8s ease-in-out infinite;
          transform-origin: 50% 82%;
          will-change: transform;
        }
        .avatar-idle-blink {
          animation: avatar-blink 8.6s linear infinite;
          transform-origin: 50% 43%;
          will-change: transform;
        }
        .avatar-idle-static,
        .avatar-idle-static .avatar-idle-breathe,
        .avatar-idle-static .avatar-idle-blink {
          animation: none;
          will-change: auto;
        }
        .avatar-frame-brackets {
          background:
            linear-gradient(#fff8 0 0) left top / 18% 1px no-repeat,
            linear-gradient(#fff8 0 0) left top / 1px 18% no-repeat,
            linear-gradient(#fff8 0 0) right top / 18% 1px no-repeat,
            linear-gradient(#fff8 0 0) right top / 1px 18% no-repeat,
            linear-gradient(#fff8 0 0) left bottom / 18% 1px no-repeat,
            linear-gradient(#fff8 0 0) left bottom / 1px 18% no-repeat,
            linear-gradient(#fff8 0 0) right bottom / 18% 1px no-repeat,
            linear-gradient(#fff8 0 0) right bottom / 1px 18% no-repeat;
        }
        .avatar-frame-signal { animation: avatar-frame-signal 5s ease-in-out infinite; }
        [data-avatar-compositor] svg path {
          transition: fill 0.25s ease-out, stroke 0.25s ease-out, opacity 0.25s ease-out;
        }
        [data-avatar-compositor] svg [id*="highlight"],
        [data-avatar-compositor] svg [class*="highlight"],
        [data-avatar-compositor] svg [id*="Highlight"],
        [data-avatar-compositor] svg path[opacity="0.12"] {
          fill: #ffffff !important;
          opacity: 0.20 !important;
          mix-blend-mode: screen !important;
        }
        @media (prefers-reduced-motion: reduce) {
          [data-avatar-compositor] *,
          [data-avatar-compositor] {
            animation: none !important;
            transition: none !important;
            will-change: auto !important;
          }
        }
      `}} />
      <defs>
        {/* Fitzpatrick skin recoloring component transfer curves */}
        <filter id="premium-fitzpatrick-recolor" x="-10%" y="-10%" width="120%" height="120%">
          <feComponentTransfer>
            <feFuncR type="table" tableValues={rTable} />
            <feFuncG type="table" tableValues={gTable} />
            <feFuncB type="table" tableValues={bTable} />
          </feComponentTransfer>
        </filter>

        {/* Global texture noise grain overlay */}
        <filter id="premium-noise-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.035 0" result="coloredNoise" />
          <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="clippedNoise" />
          <feBlend mode="multiply" in="SourceGraphic" in2="clippedNoise" />
        </filter>

        {/* Base skin inner glow to create spherical 3D volume */}
        <filter id="premium-inner-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
          <feOffset dx="-3" dy="-3" />
          <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
          <feFlood floodColor="rgba(255, 255, 255, 0.35)" />
          <feComposite in2="shadowDiff" operator="in" result="highlight" />
          
          <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur2" />
          <feOffset dx="3" dy="3" />
          <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff2" />
          <feFlood floodColor="rgba(0, 0, 0, 0.12)" />
          <feComposite in2="shadowDiff2" operator="in" result="shadow" />
          
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="highlight" />
            <feMergeNode in="shadow" />
          </feMerge>
        </filter>

        {/* Soft, layered drop shadow for hair and accessories */}
        <filter id="premium-drop-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#000000" floodOpacity="0.1" />
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.06" />
        </filter>
        
        {/* Closer drop shadow for facial features (nose, brows) */}
        <filter id="premium-feature-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.08" />
        </filter>
      </defs>
    </svg>
  );
}
