import type { Level } from "@/lib/status";

type Zone = { level: Level; to: number };

type MetricProps = {
  label: string;
  value: number;
  unit: string;
  level: Level;
  levelText: string;
  detail?: string;
  max: number;
  zones: Zone[];
  ticks: { at: number; text: string; wide?: boolean }[];
  compact?: boolean;
};

export function Metric({
  label,
  value,
  unit,
  level,
  levelText,
  detail,
  max,
  zones,
  ticks,
  compact,
}: MetricProps) {
  const pos = (n: number) => `${(Math.min(n, max) / max) * 100}%`;
  return (
    <section className={`metric ${compact ? "metric--compact" : ""}`} data-level={level}>
      <h2 className="metric__label">{label}</h2>

      <p className="metric__reading">
        <span className="metric__value">{value}</span>
        <span className="metric__unit">{unit}</span>
      </p>

      <p className="metric__status">
        <span className="metric__dot" aria-hidden />
        {levelText}
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
