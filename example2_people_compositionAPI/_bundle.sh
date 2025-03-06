#! /bin/bash

echo RUN cleanup...
rm -f wwwroot/scripts.j*
rm -f wwwroot/*.vue.*

echo RUN tailwind...
deno task tailwind

echo RUN bundler...
deno run --allow-env --allow-read --allow-write --allow-run _bundler.ts

echo "--OK--"

