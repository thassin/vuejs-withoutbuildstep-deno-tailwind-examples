
import * as path from "https://deno.land/std@0.138.0/path/mod.ts";

function getModuleDir(importMeta: ImportMeta): string {
  return path.resolve(path.dirname(path.fromFileUrl(importMeta.url)));
}

const wwwroot = getModuleDir(import.meta) + "/wwwroot";

// quickly adapted from:
// https://fitech101.aalto.fi/web-software-development-1-0/7-first-web-applications/6-serving-static-content/

import { serve } from "https://deno.land/std@0.222.1/http/server.ts";
import { serveFile } from "https://deno.land/std@0.222.1/http/file_server.ts";

import { existsSync } from "https://deno.land/std@0.222.1/fs/exists.ts";

const handleRequest = async (request) => {
  const url = new URL(request.url);

  let pathname: string = url.pathname;
  if ( pathname === "/" ) pathname += "index.html";

  console.log( ">> " + pathname );

  const path = wwwroot + pathname;

  if (existsSync(path)) {
     const fileInfo = await Deno.lstat(path);
     if (fileInfo.isFile) {
       return await serveFile(request, path);
     }
  }

  console.log( "     =>  ERROR: not found: " + pathname );
  return new Response("Not found", { status: 404 });
};

serve(handleRequest, { port: 8888 });

