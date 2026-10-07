"use client";

import Link from "next/link";
import { AREA_BY_ID, queueLevel, utilizationLevel, type Snapshot } from "@/lib/status";
import { Header, QUEUE_TEXT, STATION_TEXT } from "./Board";
import { useSnapshot } from "./useSnapshot";

export function Overview({ initial }: { initial: Snapshot }) {
  const { snapshot, offline } = useSnapshot(initial);

  return (
    <main className="board">
      <Header title="Assessment Center" current="/" updatedAt={snapshot.updatedAt} offline={offline} />
      <ul className="overview">
        {snapshot.areas.map((s) => {
          const area = AREA_BY_ID[s.id];
          return (
            <li key={s.id}>
              <Link className="row" href={`/${s.id.toLowerCase()}`}>
                <span className="row__name">
                  {area.building}
                  {area.floor && <span className="row__floor">{area.floor}</span>}
                </span>
                <span className="row__stat" data-level={queueLevel(s.queue)}>
                  <span className="row__value">{s.queue}</span>
                  <span className="row__label">in gait queue</span>
                  <span className="sr-only">{QUEUE_TEXT[queueLevel(s.queue)]}</span>
                </span>
                <span className="row__stat" data-level={utilizationLevel(s.utilization)}>
                  <span className="row__value">{s.utilization}%</span>
                  <span className="row__label">stations in use</span>
                  <span className="sr-only">{STATION_TEXT[utilizationLevel(s.utilization)]}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
