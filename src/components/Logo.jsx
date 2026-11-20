/* Logo ufficiale ZEFIRO: simbolo originale (non ridisegnato) + scritta ZEFIRO
   in tracciati vettoriali (Montserrat SemiBold, come nel file approvato).
   I file completi del logo sono in public/brand/. */
let n = 0;

export const SYMBOL_PATHS = [
  "M18 126 C39 91 61 62 94 54 C119 48 143 47 164 26 C158 53 143 72 118 81 C89 91 56 99 18 126Z",
  "M25 145 C54 113 78 91 109 84 C133 78 150 68 171 48 C164 76 148 96 122 106 C91 117 57 128 25 145Z",
];
export const BASE_PATH = "M25 145 C48 137 69 132 89 130 C106 128 121 134 137 145Z";
export const STAR_PATH = "M181 20 L186 34 L200 39 L186 44 L181 58 L176 44 L162 39 L176 34Z";
const WORDMARK = "M52.32 0L3.36 0L3.36-7.13L37.15-48.38L3.94-48.38L3.94-57.40L51.25-57.40L51.25-50.27L17.47-9.02L52.32-9.02L52.32 0ZM81.73-24.76L81.73-8.94L114.12-8.94L114.12 0L71.07 0L71.07-57.40L112.98-57.40L112.98-48.46L81.73-48.46L81.73-33.54L109.45-33.54L109.45-24.76L81.73-24.76ZM145.67-21.98L145.67 0L135.01 0L135.01-57.40L176.92-57.40L176.92-48.46L145.67-48.46L145.67-31.00L173.39-31.00L173.39-21.98L145.67-21.98ZM206.91 0L196.25 0L196.25-57.40L206.91-57.40L206.91 0ZM242.07 0L231.41 0L231.41-57.40L255.02-57.40Q262.65-57.40 268.10-54.94Q273.55-52.48 276.51-47.89Q279.46-43.30 279.46-36.98Q279.46-30.67 276.51-26.12Q273.55-21.57 268.14-19.19L268.14-19.19Q267.73-18.94 267.24-18.78L267.24-18.78L280.44 0L268.96 0L257.24-16.81Q256.17-16.73 255.02-16.73L255.02-16.73L242.07-16.73L242.07 0ZM242.07-48.38L242.07-25.50L254.53-25.50Q261.58-25.50 265.15-28.54Q268.72-31.57 268.72-36.98L268.72-36.98Q268.72-42.48 265.15-45.43Q261.58-48.38 254.53-48.38L254.53-48.38L242.07-48.38ZM327.24 0.82L327.24 0.82Q320.52 0.82 314.86-1.39Q309.20-3.61 305.02-7.58Q300.84-11.56 298.54-16.93Q296.25-22.30 296.25-28.70L296.25-28.70Q296.25-35.10 298.54-40.47Q300.84-45.84 305.02-49.82Q309.20-53.79 314.86-56.01Q320.52-58.22 327.16-58.22L327.16-58.22Q333.89-58.22 339.50-56.01Q345.12-53.79 349.30-49.82Q353.48-45.84 355.78-40.47Q358.08-35.10 358.08-28.70L358.08-28.70Q358.08-22.30 355.78-16.89Q353.48-11.48 349.30-7.54Q345.12-3.61 339.50-1.39Q333.89 0.82 327.24 0.82ZM327.16-8.53L327.16-8.53Q331.51-8.53 335.20-10.00Q338.89-11.48 341.59-14.23Q344.30-16.97 345.82-20.62Q347.33-24.27 347.33-28.70L347.33-28.70Q347.33-33.13 345.82-36.78Q344.30-40.43 341.59-43.17Q338.89-45.92 335.20-47.40Q331.51-48.87 327.16-48.87L327.16-48.87Q322.82-48.87 319.17-47.40Q315.52-45.92 312.77-43.17Q310.02-40.43 308.51-36.78Q306.99-33.13 306.99-28.70L306.99-28.70Q306.99-24.35 308.51-20.66Q310.02-16.97 312.73-14.23Q315.44-11.48 319.13-10.00Q322.82-8.53 327.16-8.53Z";

export function Symbol({ className = "", title }) {
  const id = "zg" + n++;
  return (
    <svg className={className} viewBox="14 18 190 131" xmlns="http://www.w3.org/2000/svg" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : "true"}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#123DAD" />
          <stop offset="0.55" stopColor="#1765E8" />
          <stop offset="1" stopColor="#39B8F4" />
        </linearGradient>
      </defs>
      {SYMBOL_PATHS.map(d => <path key={d} d={d} fill={`url(#${id})`} />)}
      <path d={BASE_PATH} fill="#102D78" />
      <path d={STAR_PATH} fill="#1765E8" />
    </svg>
  );
}

/* tone: "dark" = scritta bianca (su navy) · "light" = scritta navy (su chiaro) */
export default function Logo({ tone = "dark", className = "" }) {
  return (
    <span className={`logo logo--${tone} ${className}`}>
      <Symbol className="logo__sym" />
      <svg className="logo__word" viewBox="2 -60 358 62" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d={WORDMARK} fill="currentColor" />
      </svg>
      <span className="sr-only">ZEFIRO</span>
    </span>
  );
}
