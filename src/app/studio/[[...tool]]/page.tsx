import { isSanityConfigured } from "@/sanity/env";
import StudioClient from "./StudioClient";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <div style={{ padding: "3rem", fontFamily: "sans-serif", maxWidth: 560 }}>
        <h1>Sanity Studio isn&apos;t configured yet</h1>
        <p>
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
          <code>NEXT_PUBLIC_SANITY_DATASET</code> in your environment
          variables (see README.md), then reload this page.
        </p>
      </div>
    );
  }

  return <StudioClient />;
}
