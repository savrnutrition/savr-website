import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { sanityClient } from "@/sanity/client";
import { readToken } from "@/sanity/env";

// Only meaningful once Sanity is configured — this route isn't reachable
// from anywhere unless the Presentation tool is used, which requires it.
export const { GET } = defineEnableDraftMode({
  client: sanityClient!.withConfig({ token: readToken }),
});
