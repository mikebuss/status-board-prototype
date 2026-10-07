import { connection } from "next/server";
import { Overview } from "@/components/Overview";
import { simulate } from "@/lib/status";

export default async function Home() {
  await connection();
  return <Overview initial={simulate()} />;
}
