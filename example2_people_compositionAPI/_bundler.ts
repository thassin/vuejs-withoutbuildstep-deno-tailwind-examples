
// https://deno.land/x/esbuild@v0.24.2 
// https://jsr.io/@luca/esbuild-deno-loader 

// the parameters in "buildOptions" are described here:
// https://github.com/esbuild/deno-esbuild/blob/v0.24.2/mod.d.ts 

import * as esbuild from "https://deno.land/x/esbuild@v0.24.2/mod.js";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@0.11.1";

import { encodeBase64 } from "jsr:@std/encoding/base64";

const bundleComponentsIntoAppJs = false;

const vueImportTag = "my_vue_import_symbol";
const vueModuleFileName = "vue.esm-browser";

function fixVueImportStatements( jscode: string ): string {
	return jscode.replace( vueImportTag, "./" + vueModuleFileName + ".js" );
}

let buildOptions = {
  plugins: [ ...denoPlugins() ],
  external: [ vueImportTag ],
  outdir: "./wwwroot",
  bundle: true,
  platform: "browser",
  format: "esm",
  target: "esnext",
  minify: false,
  sourcemap: true,
  treeShaking: true,
};

console.log( "CHECK-starting" );

// check if vue-module-file exists (without checking file version etc) in wwwroot-directory.
// if the file not exists, try to find the file and copy it into correct location.

const vueModuleFilePath = "./wwwroot/" + vueModuleFileName + ".js";

let moduleFileExists = false;
try {
    await Deno.lstat( vueModuleFilePath );
    console.log( "vue-module-file exists: " + vueModuleFilePath );
    moduleFileExists = true;
} catch ( err ) {
    if ( err instanceof Deno.errors.NotFound === false ) {
        console.log( "unexpected file error at line 67: " + err );
        Deno.exit( 1 );
    }
}

if ( moduleFileExists === false ) {

    // cannot find the vue-module-file from wwwroot directory.
    // => guess the location where deno might have loaded the file.
    // => if found, then copy the file into wwwroot directory.
    // => if not found then report the problem and stop.

    console.log( "vue-module-file NOT FOUND: " + vueModuleFilePath );

    // read the deno.json file, and find the line with the vue-import-tag and module-name.
    // => extract the vue version and filepath from the line.

    let filePath: string;

    const json = await Deno.readTextFile( "./deno.json" );
    const lines: string[] = json.split( "\n" );
    for ( let line: string of lines ) {
        if ( line.includes( vueImportTag ) === false ) continue;
        if ( line.includes( vueModuleFileName ) === false ) continue;

        const startPos: number = line.indexOf( "@" );
        const endPos: number = line.lastIndexOf( ".js" );

        if ( startPos < 0 || endPos < 0 ) {
            console.log( "deno.json parse error: " + startPos + " " + endPos );
            Deno.exit( 1 );
        }

        filePath = line.substring( startPos + 1, endPos + 3 );
        break;
    }

    console.log( "  =>  found partial filepath from deno.json : " + filePath );

    // try to find the module-file from a cache directory in user's home directory.

    const userHomeDir = Deno.env.get( "HOME" );
    filePath = userHomeDir + "/.cache/deno/npm/registry.npmjs.org/vue/" + filePath;
    
    let fileExists = false;
    try {
        await Deno.lstat( filePath );
        console.log( "  =>  found file from path : " + filePath );
        fileExists = true;
    } catch ( err ) {
        if ( err instanceof Deno.errors.NotFound === false ) {
            console.log( "unexpected file error at line 125: " + err );
            Deno.exit( 1 );
        }
    }

    if ( fileExists === false ) {
        console.log( "ERROR: module-file not found from path: " + filePath );
        console.log( "PLEASE FIND AND COPY the file " + vueModuleFileName + ".js to wwwroot manually!" );
        Deno.exit( 1 );
    }

    await Deno.copyFile( filePath, vueModuleFilePath );
}

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

// in stage3:
//	*) fix the vue-import-statements in wwwroot/*.js files.

for ( let tsPath: string of buildOptions.entryPoints ) {
	const fileName: string = tsPath
		.replace( "./src/", "" )
		.replace( ".ts", "" );
	const jsPath: string = "./wwwroot/" + fileName + ".js";
	
	console.log( "  =>  fix imports: " + jsPath );
	
	let txt = await Deno.readTextFile( jsPath );
	txt = fixVueImportStatements( txt );
	await Deno.writeTextFile( jsPath, txt );
}

console.log( "BUILD-stage3-completed" );

await esbuild.stop();

console.log( "BUILD-exiting" );

