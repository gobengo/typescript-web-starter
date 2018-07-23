/**
 * Webpack Config for building the client-side of the application in a development environment.
 * * enable hot module reloading
 * * don't minify things
 * * be as fast as possible so hmr works well
 */
import * as htmlWebpackPlugin from "html-webpack-plugin";
import { join, resolve } from "path";
import * as webpack from "webpack";
import * as webpackMerge from "webpack-merge";
import common from "./common";

export const client: webpack.Configuration = webpackMerge(common, {
	mode: "development",
	entry: {
		main: [
			"react-hot-loader/patch", // activate HMR for React
			resolve(join(__dirname, "../../client/browser.tsx")), // the entry point of our app
		],
	},
	plugins: [
		new htmlWebpackPlugin({
			template: resolve(join(__dirname, "../../client/index.html")),
		}),
	],
});

export default client;
