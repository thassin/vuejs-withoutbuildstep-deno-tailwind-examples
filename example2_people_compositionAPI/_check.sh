#! /bin/bash

## create a temporary src/_componentData.ts -file if needed.
if ! test -f src/_componentData.ts; then
	echo "creating temporary file: src/_componentData.ts"
	echo "export function getComponent( componentName: string ): string { return ''; }" > src/_componentData.ts
fi

deno check \
	./src/scripts.ts \
	./src/component/*.vue.ts

