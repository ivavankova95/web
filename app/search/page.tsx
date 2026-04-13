import { SnapshotContentPage } from "@/components/snapshot-content-page";

export default function SearchPage() {
  return (
    <SnapshotContentPage
      layout="ContentLayout"
      notes={[
        "Search route je zatim snapshot-backed shell.",
        "Finalni search implementace bude aplikacni vrstva nad importovanymi daty, se zachovanim query parametru `query`."
      ]}
      routePath="/search"
      routeType="search"
    />
  );
}
