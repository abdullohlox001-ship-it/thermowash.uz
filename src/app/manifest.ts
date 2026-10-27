import type { MetadataRoute } from "next";
import { business } from "@/config/business";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: business.name.uz,
    short_name: business.shortName,
    start_url: "/",
    display: "browser",
    background_color: "#0E1726",
    theme_color: "#0E1726",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
