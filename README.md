
# vuejs-withoutbuildstep-deno-tailwind-examples
An example/template project for VueJS development environment without build step using Deno.

## About

This example/template project contains a simple web-development environment:

- for [VueJS](https://vuejs.org/), using plain-typescript component files only, without any '.vue' file compiler or loader
- using [Deno](https://deno.com/) runtime to check, build and process typescript/javascript code
- as a bonus, using [TailWindCSS](https://tailwindcss.com/) to get an optimized set of css style files.

## Dependencies

The dependencies are:

- Deno runtime (install information [here](https://docs.deno.com/runtime/getting_started/installation/)), I'm using Deno version 2.1.9 currently (just a **single file** installed to /usr/local/bin).
- VueJS and TailWindCSS packages from [npm](https://www.npmjs.com/) (automatically downloaded and installed by Deno as needed).

## Features

Original inspiration to this project came to me from a blog article describing [use of Vue without a build step](https://krowemoh.com/devlog/using-vue-without-a-build-step.html).

I studied the examples given in the article, and found out how I can make them work with Deno (also see [my another AlpineJS project](https://github.com/thassin/alpinejs-component-deno-tailwind-examples) using Deno).

In essence the article is about how one can create Vue components without using the `'.vue'` files, and a related compiler tool.
An another option to handle `'.vue'` files is to use [vue3-sfc-loader](https://github.com/FranckFreiburger/vue3-sfc-loader) tool instead of a compiler.
The trick of using a plain js (and, hence, ts) file as a component is described in the [last section of the article](https://krowemoh.com/devlog/using-vue-without-a-build-step.html#13).

Instead of `'.vue'` files, I'm using plain typescript files with extension `'.vue.ts'` to indicate that the file is a Vue component.
Therefore I can simply type-check and compile the files as plain typescript files, with no need to any other tooling.

I'm using bash shell scripts for the development tasks:

- _check.sh : to run typescript checks for all source code.
- _bundle.sh : to build typescript code and transfer the results into wwwroot directory.
- _test.sh : to launch a test www-server on localhost port 8888.

## Running the examples

1. Clone this repository.
2. Make sure you have a Bash shell with Deno runtime installed and available (you can try command `deno --version` to test your Deno install).
3. Enter into example directory of your choice.
4. Optionally, run `./_check.sh` to run typescript checks.
5. Run `./_bundle.sh` to build typescript code and update `wwwroot` directory.
6. Run `./_test.sh` to start a Deno test www-server on localhost port 8888.
7. Start a web browser and go to address `http://localhost:8888`.

## About examples

The examples are based on the [blog article](https://krowemoh.com/devlog/using-vue-without-a-build-step.html), covering the two alternate programming styles in Vue:

- `example1_people_optionsAPI` uses [OptionsAPI](https://vuejs.org/api/options-state), and it bundles the Vue javascript code into `scripts.js` file.
- `example2_people_compositionAPI` uses [CompositionAPI](https://vuejs.org/api/composition-api-setup.html), and it uses Vue as a separate javascript module.

