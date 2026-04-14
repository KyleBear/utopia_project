import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://utopia.kr";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/posts/"],
        disallow: ["/admin", "/profile", "/my-posts", "/posts/new", "/posts/*/edit"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
