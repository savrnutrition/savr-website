import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageRef } from "@/lib/content/types";
import { dataset, projectId } from "./env";

const builder =
  projectId && dataset ? createImageUrlBuilder({ projectId, dataset }) : null;

export function urlForImage(source?: SanityImageRef) {
  if (!builder || !source?.asset?._ref) return undefined;
  return builder.image(source).auto("format").fit("max");
}
