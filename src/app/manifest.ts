import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: SITE.appId,
    name: SITE.name,
    short_name: "EXPal",
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fdf8f7",
    theme_color: "#f25c54",
    lang: "en-IE",
    icons: [
      {
        src: "/expal-logo.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    related_applications: [
      {
        platform: "play",
        url: `https://play.google.com/store/apps/details?id=${SITE.appId}`,
        id: SITE.appId,
      },
    ],
  };
}
