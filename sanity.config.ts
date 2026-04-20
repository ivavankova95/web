'use client';

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "@/sanity/schemaTypes";
import { deskStructure } from "@/sanity/desk-structure";

export default defineConfig({
  name: "default",
  title: "Zdraví mě baví",
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "4zoa6lwe",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  plugins: [structureTool({ structure: deskStructure })],
  schema: {
    types: schemaTypes
  }
});
