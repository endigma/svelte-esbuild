import svelte from "rollup-plugin-svelte";
import spp from "svelte-preprocess";
import { typescript } from "svelte-preprocess";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-only";

import { transformSync } from "esbuild";
import esbuild from "rollup-plugin-esbuild";

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require("child_process").spawn("yarn", ["run", "start", "--dev"], {
				stdio: ["ignore", "inherit", "inherit"],
				shell: true,
			});

			process.on("SIGTERM", toExit);
			process.on("exit", toExit);
		},
	};
}

export default {
	input: "src/index.ts",

	output: {
		sourcemap: true,
		format: "iife",
		name: "app",
		file: "public/bundle/bundle.js",
	},

	plugins: [
		esbuild({}),
		svelte({
			// ! does not work
			// from docs
			// https://github.com/sveltejs/svelte-preprocess/blob/main/docs/preprocessing.md#overriding-preprocessors
			preprocess: [
				spp({
					typescript({ content }) {
						const { code, map } = transformSync(content, {
							loader: "ts",
						});
						return { code, map };
					},
				}),
			],

			// ! works
			// preprocess: [
			// 	typescript({
			// 		typescript({ content }) {
			// 			const { code, map } = transformSync(content, {
			// 				loader: "ts",
			// 			});
			// 			return { code, map };
			// 		},
			// 	}),
			// 	spp({
			// 		typescript: false
			// 	}),
			// ],

			compilerOptions: {
				dev: !production,
			},
		}),

		// separate css
		css({ output: "bundle.css" }),

		resolve({
			browser: true,
			dedupe: ["svelte"],
		}),
		commonjs(),

		!production && serve(),
		!production && livereload("public"),

		production && terser(),
	],

	watch: {
		clearScreen: false,
	},
};
