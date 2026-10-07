import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Board } from "@/components/Board";
import { LOCATIONS, simulate } from "@/lib/status";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(LOCATIONS).map((location) => ({ location }));
}

export async function generateMetadata(props: PageProps<"/[location]">): Promise<Metadata> {
  const loc = LOCATIONS[(await props.params).location];
  return { title: loc ? [loc.title, loc.subtitle].filter(Boolean).join(" ") : undefined };
}

export default async function LocationPage(props: PageProps<"/[location]">) {
  const { location } = await props.params;
  const loc = LOCATIONS[location];
  if (!loc) notFound();
  await connection();

  return (
    <Board
      initial={simulate()}
      path={`/${location}`}
      title={loc.title}
      subtitle={loc.subtitle}
      areas={loc.areas}
    />
  );
}
