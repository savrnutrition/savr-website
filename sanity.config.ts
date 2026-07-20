"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { presentationTool } from "sanity/presentation";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";

export default defineConfig({
  basePath: "/studio",
  projectId: projectId || "",
  dataset: dataset || "production",
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    // "Edit" tab in Studio — a live view of the real site with click-to-edit
    // overlays on the actual rendered text/images, instead of only a form.
    presentationTool({
      previewUrl: {
        previewMode: { enable: "/api/draft-mode/enable" },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
