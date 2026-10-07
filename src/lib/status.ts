export type AreaId = "S" | "NEU1" | "NEU2" | "CCAC";
export type Level = "good" | "watch" | "alert";

export type Area = {
  id: AreaId;
  building: string;
  floor?: string;
  stations: number;
};

export type AreaStatus = {
  id: AreaId;
  queue: number;
  stationsInUse: number;
  stationsTotal: number;
  utilization: number;
};

export type Snapshot = {
  updatedAt: number;
  areas: AreaStatus[];
};

export const AREAS: Area[] = [
  { id: "S", building: "S", stations: 12 },
  { id: "NEU1", building: "NEU", floor: "Floor 1", stations: 8 },
  { id: "NEU2", building: "NEU", floor: "Floor 2", stations: 10 },
  { id: "CCAC", building: "CCAC", stations: 6 },
];

export const AREA_BY_ID = Object.fromEntries(AREAS.map((a) => [a.id, a])) as Record<AreaId, Area>;

// Display routes. NEU gets a combined page plus one page per floor.
export const LOCATIONS: Record<string, { title: string; subtitle?: string; areas: AreaId[] }> = {
  s: { title: "S", areas: ["S"] },
  neu: { title: "NEU", areas: ["NEU1", "NEU2"] },
  neu1: { title: "NEU", subtitle: "Floor 1", areas: ["NEU1"] },
  neu2: { title: "NEU", subtitle: "Floor 2", areas: ["NEU2"] },
  ccac: { title: "CCAC", areas: ["CCAC"] },
};

export const REFRESH_MS = 5000;

// Gait queue: <5 green, >=5 and <10 yellow, >=10 red
export function queueLevel(count: number): Level {
  if (count < 5) return "good";
  if (count < 10) return "watch";
  return "alert";
}

// Assessment stations utilized: <80% green, >=80% and <90% yellow, >=90% red
export function utilizationLevel(percent: number): Level {
  if (percent < 80) return "good";
  if (percent < 90) return "watch";
  return "alert";
}

const SEEDS: Record<AreaId, number> = { S: 1.3, NEU1: 4.1, NEU2: 2.7, CCAC: 5.9 };

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

// Fake data: slow waves keyed to wall-clock time, so every screen shows the same
// numbers and each area drifts through all three status ranges over a few minutes.
export function simulate(now = Date.now()): Snapshot {
  const t = Math.floor(now / REFRESH_MS);
  return {
    updatedAt: t * REFRESH_MS,
    areas: AREAS.map((area) => {
      const s = SEEDS[area.id];
      const queue = Math.round(
        clamp(7 + 6.5 * Math.sin(t / 37 + s) + 1.5 * Math.sin(t / 5 + s * 3), 0, 18),
      );
      const load = 0.8 + 0.17 * Math.sin(t / 53 + s * 2) + 0.05 * Math.sin(t / 7 + s);
      const stationsInUse = Math.round(clamp(load, 0, 1) * area.stations);
      return {
        id: area.id,
        queue,
        stationsInUse,
        stationsTotal: area.stations,
        utilization: Math.round((stationsInUse / area.stations) * 100),
      };
    }),
  };
}
