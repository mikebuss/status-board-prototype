"use client";

import Link from "next/link";
import {
  AREA_BY_ID,
  queueLevel,
  utilizationLevel,
  type AreaId,
  type AreaStatus,
  type Level,
  type Snapshot,
} from "@/lib/status";
import { Metric } from "./Metric";
import { useSnapshot } from "./useSnapshot";

export const QUEUE_TEXT: Record<Level, string> = {
  good: "Short wait",
  watch: "Moderate wait",
  alert: "Long wait",
};

export const STATION_TEXT: Record<Level, string> = {
  good: "Available",
  watch: "Busy",
  alert: "Very busy",
};

const QUEUE_MAX = 15;

export function AreaMetrics({ status, compact }: { status: AreaStatus; compact?: boolean }) {
  const qLevel = queueLevel(status.queue);
  const uLevel = utilizationLevel(status.utilization);
  return (
    <>
      <Metric
        compact={compact}
        label="Gait queue"
        value={status.queue}
        unit={status.queue === 1 ? "person waiting" : "people waiting"}
        level={qLevel}
        levelText={QUEUE_TEXT[qLevel]}
        max={QUEUE_MAX}
        zones={[
          { level: "good", to: 5 },
          { level: "watch", to: 10 },
          { level: "alert", to: QUEUE_MAX },
        ]}
        ticks={[
          { at: 0, text: "0" },
          { at: 5, text: "5" },
          { at: 10, text: "10" },
          { at: QUEUE_MAX, text: `${QUEUE_MAX}+` },
        ]}
      />
      <Metric
        compact={compact}
        label="Assessment stations"
        value={status.utilization}
        unit="% in use"
        level={uLevel}
        levelText={STATION_TEXT[uLevel]}
        detail={`${status.stationsInUse} of ${status.stationsTotal}`}
        max={100}
        zones={[
          { level: "good", to: 80 },
          { level: "watch", to: 90 },
          { level: "alert", to: 100 },
        ]}
        ticks={[
          { at: 0, text: "0" },
          { at: 80, text: "80" },
          { at: 90, text: "90" },
          { at: 100, text: "100%", wide: true },
        ]}
      />
    </>
  );
}

const NAV = [
  { href: "/", text: "All" },
  { href: "/s", text: "S" },
  { href: "/neu", text: "NEU" },
  { href: "/neu1", text: "NEU1" },
  { href: "/neu2", text: "NEU2" },
  { href: "/ccac", text: "CCAC" },
];

export function Header({
  title,
  subtitle,
  current,
  updatedAt,
  offline,
}: {
  title: string;
  subtitle?: string;
  current: string;
  updatedAt: number;
  offline: boolean;
}) {
  return (
    <header className="header">
      <h1 className="header__title">
        {title}
        {subtitle && <span className="header__subtitle">{subtitle}</span>}
      </h1>
      <p className="live" data-offline={offline || undefined}>
        <span className="live__dot" aria-hidden />
        {offline ? "Reconnecting" : "Live"}
        <time className="live__time" suppressHydrationWarning>
          {new Date(updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
        </time>
      </p>
      <nav className="nav" aria-label="Locations">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} aria-current={n.href === current ? "page" : undefined}>
            {n.text}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function Board({
  initial,
  path,
  title,
  subtitle,
  areas,
}: {
  initial: Snapshot;
  path: string;
  title: string;
  subtitle?: string;
  areas: AreaId[];
}) {
  const { snapshot, offline } = useSnapshot(initial);
  const statuses = areas.map((id) => snapshot.areas.find((a) => a.id === id)!);
  const split = statuses.length > 1;

  return (
    <main className="board" data-split={split || undefined}>
      <Header
        title={title}
        subtitle={subtitle}
        current={path}
        updatedAt={snapshot.updatedAt}
        offline={offline}
      />
      <div className="board__body">
        {statuses.map((status) => (
          <div className="area" key={status.id}>
            {split && <h2 className="area__name">{AREA_BY_ID[status.id].floor}</h2>}
            <div className="area__metrics">
              <AreaMetrics status={status} compact={split} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
