import { createClient } from "next-sanity";
import { env } from "@/lib/env";

export const sanityClient = createClient({
  projectId: env.sanityProjectId || "placeholder-project",
  dataset: env.sanityDataset,
  apiVersion: "2026-04-11",
  useCdn: true
});

