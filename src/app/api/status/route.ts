import { connection } from "next/server";
import { simulate } from "@/lib/status";

export async function GET() {
  await connection();
  return Response.json(simulate(), {
    headers: { "Cache-Control": "no-store" },
  });
}
