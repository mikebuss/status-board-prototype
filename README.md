# status-board-prototype

Public intranet status board for the assessment center: live gait queue count and assessment station utilization per location. No auth. Data is simulated.

## Pages

| Route   | Shows                     |
| ------- | ------------------------- |
| `/`     | All locations             |
| `/s`    | S building                |
| `/neu`  | NEU, both floors split    |
| `/neu1` | NEU floor 1               |
| `/neu2` | NEU floor 2               |
| `/ccac` | CCAC building             |

Pages poll `GET /api/status` every 5 seconds.

## Status ranges

| Metric                        | Green | Yellow        | Red   |
| ----------------------------- | ----- | ------------- | ----- |
| Gait queue (people)           | < 5   | >= 5 and < 10 | >= 10 |
| Assessment stations utilized  | < 80% | >= 80% and < 90% | >= 90% |

Thresholds live in `src/lib/status.ts` (`queueLevel`, `utilizationLevel`).

## Fake data

`simulate()` in `src/lib/status.ts` derives values from wall-clock time, so every screen shows the same numbers and each location cycles through all three ranges over a few minutes. Replace it with the real source when one exists; the `Snapshot` shape is the contract the pages consume.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```
