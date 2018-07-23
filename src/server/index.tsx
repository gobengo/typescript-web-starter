/**
 * Web Server that serves App to end-users' web browsers
 */
import { existsSync, readFileSync } from "fs";
import { IncomingMessage, ServerResponse } from "http";
import { Http2ServerRequest, Http2ServerResponse } from 'http2'; // tslint:disable-line:no-implicit-dependencies
import * as Application from "koa";
import * as koaMount from "koa-mount";
import * as koaStatic from "koa-static";
import * as koaWebpack from "koa-webpack";
import { join } from "path";
// @ts-ignore noUnusedLocals because we need to import React so tsc can generate declarations for AppType, but we dont actually use it here.
import * as React from "react";
import { Action, ReducersMapObject } from 'redux';
import * as webpack from "webpack";
import { AppType } from '../client/components/apps/App';
import { reducers as allReducers } from "../client/reducers"
import clientDev from "../etc/webpack/client.dev";
import clientProd, { clientStatsFilename } from "../etc/webpack/client.prod";
import { log } from "../log"
import render, { htmlElementTemplate } from "./render";

type ServeBundleOption = "static" | "devMiddleware" | false;
interface Config {
	dev: boolean;
	ssr: boolean;
	csr: boolean;
	serveBundle: ServeBundleOption;
	webpackConfig: webpack.Configuration;
}

export const clientStatsFromWebpackConfig = async (
	webpackConfig: webpack.Configuration,
) => {
	const stats: webpack.Stats = await new Promise<webpack.Stats>(
		(resolve, reject) => {
			webpack([webpackConfig]).run((err, ret) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(ret);
			});
		},
	);
	interface Stats {
		children: webpack.Stats[];
	}
	const statsJson: Stats = stats.toJson() as Stats;
	const clientStats = statsJson.children[0]; //tslint:disable-line:no-unsafe-any
	return clientStats;
};

export const createSsrMiddleware = async <S, A extends Action>({
	App,
	webpackConfig,
	clientStats,
	reducers,
}: {
	App: AppType<S, A>;
	webpackConfig: webpack.Configuration;
	clientStats: webpack.Stats | Promise<webpack.Stats>;
	reducers: ReducersMapObject;
}): Promise<Application.Middleware> => {
	return render({
		App,
		clientStats: await Promise.resolve(clientStats),
		onRedirect,
		webpackConfig,
		reducers,
	});
};

const noopMiddleware: Application.Middleware = async (ctx, next) => {
	await next();
};
const promisedMiddleware = (
	p: Promise<Application.Middleware>,
	initial: Application.Middleware = noopMiddleware,
): Application.Middleware => {
	let mw: Application.Middleware;
	let err: Error;
	p.then(f => {
		mw = f;
	}).catch((e: Error) => (err = e));
	return async (ctx, next) => {
		if (err) {
			throw err;
		}
		if (typeof mw === "function") {
			return mw(ctx, next);
		}
		return initial(ctx, next);
	};
};

const clientSideRenderer = (webpackConfig: webpack.Configuration) => async (
	ctx: Application.Context,
) => {
	ctx.response.type = "html";
	const bundleSrc =
		webpackConfig.output &&
		webpackConfig.output.filename &&
		join(webpackConfig.output.publicPath || "/", "main.js");
	ctx.response.body = htmlElementTemplate({
		bodyEnd: (bundleSrc && `<script async src="${bundleSrc}"></script>`) || "",
	});
};

const configWithDefaults = (userConfig: Partial<Config>): Config => {
	return {
		dev: false,
		ssr: true,
		csr: true,
		serveBundle: userConfig.dev ? "devMiddleware" : "static",
		webpackConfig: userConfig.dev ? clientDev : clientProd,
		...userConfig,
	};
};

const serveDistFilesMiddleware = (config: Config) => {
	switch (config.serveBundle) {
		case "static":
			const webpackOut =
				config.webpackConfig &&
				config.webpackConfig.output &&
				config.webpackConfig.output.path;
			if (!webpackOut) {
				throw new Error(
					"Cant determine directory to serve as /dist for webpack files",
				);
			}
			return koaStatic(webpackOut);
		default:
			return promisedMiddleware(
				koaWebpack({
					config: config.webpackConfig,
					devMiddleware: {
						// logLevel: 'warn',
						publicPath: "/",
					},
					hotClient: {
						// logLevel: 'warn',
					},
				}),
			);
	}
};

const servePublicPathMiddleware = (config: Config) => {
	const publicPath =
		(config.webpackConfig &&
			config.webpackConfig.output &&
			config.webpackConfig.output.publicPath &&
			config.webpackConfig.output.publicPath.replace(/\/$/, "")) ||
		"/";
	return koaMount(publicPath, serveDistFilesMiddleware(config));
};

const parseStatsJsonFile = <T extends {}>(file: string) => {
	const s = readFileSync(file, "utf8");
	const p = JSON.parse(s) as T;
	return p;
};

export const clientStatsFromFile = (webpackConfig: webpack.Configuration, filename: string) => {
	const statsJsonFile =
		webpackConfig.output &&
		webpackConfig.output.path &&
		join(webpackConfig.output.path, clientStatsFilename);
	if ( ! statsJsonFile) {
		throw new Error('Could not build full path to statsJsonFile')
	}
	if (! existsSync(statsJsonFile)) {
		throw new Error(`statsJsonFile does not exist: ${statsJsonFile}`)
	}
	return parseStatsJsonFile(statsJsonFile) as webpack.Stats // tslint:disable-line:no-unnecessary-type-assertion
}

export const readOrBuildClientStats = async (config: webpack.Configuration, statsFile: string) => {
	if (statsFile) {
		try {
			return clientStatsFromFile(config, statsFile)
		} catch (error) {
			log("error", `error with clientStatsFromFile ${statsFile}. Will try building clientStats from scratch`, (error as Error))
		}
	}
	return clientStatsFromWebpackConfig(config)
}

export type RequestListener = (req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse) => void

export const AppsWebServer = <S, A extends Action>(App: AppType<S, A>, userConfig: Partial<Config>) => {
	const app = new Application();
	const config: Config = configWithDefaults(userConfig);
	if (config.serveBundle) {
		app.use(servePublicPathMiddleware(config));
	}
	if (config.ssr) {
		const clientStats = readOrBuildClientStats(config.webpackConfig, clientStatsFilename)
		app.use(
			promisedMiddleware(
				createSsrMiddleware({
					App,
					webpackConfig: config.webpackConfig,
					clientStats,
					reducers: allReducers,
				}),
				async (ctx, next) => {
					if (config.csr) {
						return next();
					}
					// if there's no csr (client side render), then we can't succeed at this point until the createSsrMiddleware promise resolves.
					ctx.status = 503;
					ctx.body =
						"Try again soon. Waiting for first build of client to enable server-side rendering.";
					await next();
				},
			),
		);
	}
	if (config.csr) {
		app.use(clientSideRenderer(config.webpackConfig));
	}
	return {
		createRequestListener(): RequestListener {
			return app.callback()
		},
	};
};

export const onRedirect = ({
	url,
	status,
}: {
	url: string;
	status: number;
}): Application.Middleware => ctx => {
	ctx.redirect(url);
	ctx.status = status || 302;
};
