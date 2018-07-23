/**
 * Webpack Configuration for building the client into a folder so it can be deployed.
 * * minify it
 * * do any last minute checks. after this, browsers will load everything this outputs
 */
import * as htmlWebpackPlugin from "html-webpack-plugin";
// import { log } from "../../log"
import { join, resolve } from "path";
import * as webpack from "webpack";
import * as webpackMerge from "webpack-merge";
import common from "./common";

import { WebpackPluginStats } from "./webpack-plugin-stats";

export const clientStatsFilename = "client.stats.json";

const client: webpack.Configuration = webpackMerge(common, {
	mode: "production",
	entry: [
		resolve(join(__dirname, "../../client/browser.tsx")), // the entry point of our app
	],
	plugins: [
		new WebpackPluginStats(clientStatsFilename),
		new htmlWebpackPlugin({
			template: resolve(join(__dirname, "../../client/index.html")),
		}),
	],
});

export default client;
