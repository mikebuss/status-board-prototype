import type { Level } from "@/lib/status";

type Zone = { level: Level; to: number };

type MetricProps = {
  label: string;
  heading: "h2" | "h3";
  level: Level;
  levelText: string;
  value: number;
  valueText: string;
  unit: string;
  detail?: string;
  max: number;
  zones: Zone[];
  ticks: { at: number; text: string; wide?: boolean }[];
};

export function Metric({
  label,
  heading: Heading,
  level,
  levelText,
  value,
  valueText,
  unit,
  detail,
  max,
  zones,
  ticks,
}: MetricProps) {
  const pos = (n: number) => `${(Math.min(n, max) / max) * 100}%`;

  return (
    <section className="metric" data-level={level}>
      <Heading className="metric__label">{label}</Heading>

      <p className="metric__status">
        <span className="metric__dot" aria-hidden />
        {levelText}
      </p>

      <p className="metric__reading">
        <span>
          <strong>{valueText}</strong> {unit}
        </span>
        {detail && <span className="metric__detail">{detail}</span>}
      </p>

      <div className="scale" aria-hidden>
        <div className="scale__track">
          {zones.map((z, i) => {
            const left = i === 0 ? 0 : zones[i - 1].to;
            return (
              <span
                key={z.level}
                className="scale__zone"
                data-zone={z.level}
                data-active={z.level === level || undefined}
                style={{ left: pos(left), width: `calc(${pos(z.to)} - ${pos(left)})` }}
              />
            );
          })}
          <span className="scale__marker" style={{ left: pos(value) }} />
        </div>
        <div className="scale__ticks">
          {ticks.map((t) => (
            <span
              key={t.at}
              data-wide-only={t.wide || undefined}
              style={{ left: pos(t.at), translate: t.at === 0 ? "0" : t.at >= max ? "-100%" : "-50%" }}
            >
              {t.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
