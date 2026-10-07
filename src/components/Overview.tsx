"use client";

import Link from "next/link";
import { AREA_BY_ID, queueLevel, utilizationLevel, type Snapshot } from "@/lib/status";
import { Header, QUEUE_TEXT, STATION_TEXT } from "./Board";
import { useSnapshot } from "./useSnapshot";

export function Overview({ initial }: { initial: Snapshot }) {
  const { snapshot, offline } = useSnapshot(initial);

  return (
    <main className="board">
      <Header title="All locations" current="/" updatedAt={snapshot.updatedAt} offline={offline} />
      <ul className="overview">
        {snapshot.areas.map((s) => {
          const area = AREA_BY_ID[s.id];
          const qLevel = queueLevel(s.queue);
          const uLevel = utilizationLevel(s.utilization);
          return (
            <li key={s.id}>
              <Link className="row" href={`/${s.id.toLowerCase()}`}>
                <span className="row__name">
                  {area.building}
                  {area.floor && <span className="row__floor">{area.floor}</span>}
                </span>
                <span className="row__stat" data-level={qLevel}>
                  <span className="row__label">Gait queue</span>
                  <span className="row__status">{QUEUE_TEXT[qLevel]}</span>
                  <span className="row__value">{s.queue} waiting</span>
                </span>
                <span className="row__stat" data-level={uLevel}>
                  <span className="row__label">Stations</span>
                  <span className="row__status">{STATION_TEXT[uLevel]}</span>
                  <span className="row__value">{s.utilization}% in use</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
