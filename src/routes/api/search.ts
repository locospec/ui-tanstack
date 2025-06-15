import { source } from "@/lib/source";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { structure } from "fumadocs-core/mdx-plugins";
import { createSearchAPI } from "fumadocs-core/search/server";

const server = createSearchAPI("advanced", {
  indexes: source.getPages().map(page => ({
    id: page.url,
    url: page.url,
    title: page.data.title!,
    structuredData: structure(page.data.content),
  })),
});

export const ServerRoute = createServerFileRoute("/api/search").methods({
  GET: async ({ request }) => server.GET(request),
});
