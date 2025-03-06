
// https://deno.land/x/esbuild@v0.24.2 
// https://jsr.io/@luca/esbuild-deno-loader 

// the parameters in "buildOptions" are described here:
// https://github.com/esbuild/deno-esbuild/blob/v0.24.2/mod.d.ts 

import * as esbuild from "https://deno.land/x/esbuild@v0.24.2/mod.js";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@0.11.1";

import { encodeBase64 } from "jsr:@std/encoding/base64";

const bundleComponentsIntoAppJs = false;

let buildOptions = {
  plugins: [ ...denoPlugins() ],
  outdir: "./wwwroot",
  bundle: true,
  platform: "browser",
  format: "esm",
  target: "esnext",
  minify: false,
  sourcemap: true,
  treeShaking: true,
};

console.log( "BUILD-starting : bundleComponentsIntoAppJs=" + bundleComponentsIntoAppJs );

// in stage1:
//	*) build js code for non-toplevel-components.

buildOptions.entryPoints = [
//	"./src/component/appmain.vue.ts",	// the TOPLEVEL component goes into "scripts".
	"./src/component/peopletable.vue.ts",
	"./src/component/hello.vue.ts",
];

await esbuild.build( buildOptions );

console.log( "BUILD-stage1-completed" );

// in stage2 :
//	*) generate the _componentData.ts file, and
//	*) build the "scripts.js" file.

const componentDataTsFile = "./src/_componentData.ts";

if ( bundleComponentsIntoAppJs ) {
	console.log( "bundle components into " + componentDataTsFile + ":" );

        let jscode = "";
	for ( let tsPath: string of buildOptions.entryPoints ) {
		const compName: string = tsPath
			.replace( "./src/component/", "" )
			.replace( ".vue.ts", "" );
		const jsPath: string = "./wwwroot/" + compName + ".vue.js";
		
		console.log( "  =>  component: " + jsPath );
		
		const txt = await Deno.readTextFile( jsPath );
		const base64 = encodeBase64( txt );
		
		jscode += "\t";
		jscode += "if ( componentName === \"" + compName + "\" ) ";
		jscode += "return `data:text/javascript;base64," + base64 + "`;" + "\n";
		
		// remove the file in jsPath (and also the mapfile).
		Deno.remove( jsPath );
		Deno.remove( jsPath + ".map" );
	}
	
	const fileContents = `
export function getComponent( componentName: string ): string {
	// the javascript code of each component is stored here as a data-URL:

${ jscode }
	// if we arrive here the component we are looking for is missing.
	throw new RangeError( "unknown component: " + componentName );
}` + "\n\n";

	await Deno.writeTextFile( componentDataTsFile, fileContents );
} else {
	console.log( "write default " + componentDataTsFile );
	
	const fileContents = `
export function getComponent( componentName: string ): string {
	return "./" + componentName + ".vue.js";
}
` + "\n\n";

	await Deno.writeTextFile( componentDataTsFile, fileContents );
}

buildOptions.entryPoints = ["./src/scripts.ts"];

await esbuild.build( buildOptions );

console.log( "BUILD-stage2-completed" );

await esbuild.stop();

console.log( "BUILD-exiting" );

