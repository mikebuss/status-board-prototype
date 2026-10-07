"use client";

import Link from "next/link";
import { useRef } from "react";
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

export function AreaMetrics({ status, heading }: { status: AreaStatus; heading: "h2" | "h3" }) {
  const qLevel = queueLevel(status.queue);
  const uLevel = utilizationLevel(status.utilization);
  return (
    <>
      <Metric
        heading={heading}
        label="Gait queue"
        level={qLevel}
        levelText={QUEUE_TEXT[qLevel]}
        value={status.queue}
        valueText={String(status.queue)}
        unit={status.queue === 1 ? "person waiting" : "people waiting"}
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
        heading={heading}
        label="Assessment stations"
        level={uLevel}
        levelText={STATION_TEXT[uLevel]}
        value={status.utilization}
        valueText={`${status.utilization}%`}
        unit="in use"
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
  { href: "/", text: "All locations" },
  { href: "/s", text: "S" },
  { href: "/neu", text: "NEU" },
  { href: "/neu1", text: "NEU Floor 1" },
  { href: "/neu2", text: "NEU Floor 2" },
  { href: "/ccac", text: "CCAC" },
];

function LocationMenu({ current }: { current: string }) {
  const menu = useRef<HTMLElement>(null);
  return (
    <>
      <button
        type="button"
        className="menu-button"
        popoverTarget="locations"
        aria-label="Change location"
      >
        <svg viewBox="0 0 20 20" aria-hidden>
          <circle cx="4" cy="10" r="1.6" />
          <circle cx="10" cy="10" r="1.6" />
          <circle cx="16" cy="10" r="1.6" />
        </svg>
      </button>
      <nav id="locations" ref={menu} className="menu" popover="auto" aria-label="Locations">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            aria-current={n.href === current ? "page" : undefined}
            onClick={() => menu.current?.hidePopover()}
          >
            {n.text}
          </Link>
        ))}
      </nav>
    </>
  );
}

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
      <LocationMenu current={current} />
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
          <section className="area" key={status.id}>
            {split && <h2 className="area__name">{AREA_BY_ID[status.id].floor}</h2>}
            <div className="area__metrics">
              <AreaMetrics status={status} heading={split ? "h3" : "h2"} />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
