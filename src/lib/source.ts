import {
  loader,
  type MetaData,
  type PageData,
  type Source,
  type VirtualFile,
} from "fumadocs-core/source";
import matter from "gray-matter";
import * as icons from "lucide-static";
import * as path from "node:path";

const files = Object.entries(
  import.meta.glob<true, "raw">("/src/content/**/*", {
    eager: true,
    query: "?raw",
    import: "default",
  })
);

const virtualFiles: VirtualFile[] = files.flatMap(([file, content]) => {
  const ext = path.extname(file);
  // Remove the leading /src/ from the file path
  const relativePath = file.startsWith('/src/') ? file.slice(5) : file;
  const virtualPath = path.relative("content", relativePath);

  if (ext === ".mdx" || ext === ".md") {
    const parsed = matter(content);

    return {
      type: "page",
      path: virtualPath,
      data: {
        ...parsed.data,
        content: parsed.content,
      },
    };
  }

  if (ext === ".json") {
    return {
      type: "meta",
      path: virtualPath,
      data: JSON.parse(content),
    };
  }

  return [];
});

export const source = loader({
  source: {
    files: virtualFiles,
  } as Source<{
    pageData: PageData & {
      content: string;
    };
    metaData: MetaData;
  }>,
  baseUrl: "/docs",
  // @ts-expect-error -- string
  icon(icon) {
    if (!icon) {
      return;
    }

    if (icon in icons) return icons[icon as keyof typeof icons];
  },
});
