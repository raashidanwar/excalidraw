import { serve } from "https://deno.land/std@0.182.0/http/server.ts";
import { serveFile } from "https://deno.land/std@0.182.0/http/file_server.ts";
import { fromFileUrl } from "https://deno.land/std@0.182.0/path/mod.ts";

const rootDir = fromFileUrl(new URL("./excalidraw-app/build", import.meta.url));

serve(async (req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  console.log(`Request received for: ${pathname}`);

  try {
    const filePath = `${rootDir}${pathname}`;

    try {
      const fileInfo = await Deno.stat(filePath);
      if (fileInfo.isFile) {
        return serveFile(req, filePath);
      }
    } catch {

    }

    console.log(`Serving index.html for SPA route: ${pathname}`);
    return serveFile(req, `${rootDir}/index.html`);
  } catch (error) {
    console.error(`Error serving request for ${pathname}:`, error);
    return new Response("Internal Server Error", { status: 500 });
  }
});