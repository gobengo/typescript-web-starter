/**
 * Server rendering of Components to HTML
 */
import {
	createGenerateClassName,
	createMuiTheme,
	MuiThemeProvider,
} from "@material-ui/core/styles";
import { Context, Middleware } from "koa";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { SheetsRegistry } from "react-jss/lib/jss"; // tslint:disable-line:no-submodule-imports
import { StaticRouterContext } from "react-router";
import { ReportChunks } from "react-universal-component";
import * as webpack from "webpack";
import webpackFlushChunks from "webpack-flush-chunks";

import { DefaultAction, DefaultState } from "../client/store";
import clientDev from "../etc/webpack/client.dev"
import { clientStatsFilename } from '../etc/webpack/client.prod';
import { log } from "../log"
import { jssSsrId } from "./ssr";

import JssProvider from "react-jss/lib/JssProvider"; // tslint:disable-line:no-submodule-imports
import { ReducersMapObject, Store } from "redux";
import { readOrBuildClientStats } from '.';
import { AppProps, NodeJSAppContainer } from '../client/components/containers/NodeJSAppContainer';

const WriteInitialState: React.SFC<{ state: DefaultState }> = props => {
	return (
		<>
			<script
				// tslint:disable:react-no-dangerous-html
				dangerouslySetInnerHTML={{
					__html: `
					window.__INITIAL_STATE__=${JSON.stringify(
						props.state,
						null,
						2,
					).replace(/</g, "\\u003c")};
					`,
				}}
				// tslint:enable:react-no-dangerous-html
			/>
			{props.children}
		</>
	);
};

export const htmlElementTemplate = (props: RenderHtmlProps) => {
	return `<!doctype html>
      <html>
        <head>
          ${props.head || ""}
        </head>
        <body>
          <div id="root">${props.ssrHtml || ""}</div>
          ${props.bodyEnd || ""}
        </body>
      </html>`;
};

interface RenderOptions<S, A extends DefaultAction> {
	App: React.ComponentType<AppProps<Store<S, A>>>
	clientStats: webpack.Stats;
	webpackConfig: webpack.Configuration;
	reducers: ReducersMapObject<S, A>
	onRedirect(opts: { url: string; status?: number }): Middleware;
}

interface RenderToHtmlOptions<S, A extends DefaultAction> {
	App: React.ComponentType<AppProps<Store<S, A>>>
	path: string
	clientStats: webpack.Stats
	webpackConfig: webpack.Configuration
	reducers: ReducersMapObject<S, A>
}

interface RenderedRedirect {
	url: string,
	status?: number,
}

interface RenderedApp {
	responseBody: string
	redirect?: RenderedRedirect
}

export const renderToHtml = <S, A extends DefaultAction>(o: RenderToHtmlOptions<S, A>): RenderedApp => {
	const { clientStats, webpackConfig } = o;
	const routerContext: StaticRouterContext & { status?: number } = {};
	const sheetsRegistry = new SheetsRegistry();
	const theme = createMuiTheme();
	const chunkNames: string[] = [];
	const report = (chunkName: string) => chunkNames.push(chunkName);
	const App = o.App;
	const appHtml = renderToString(
		<>
		<ReportChunks report={report}>
			<JssProvider
				registry={sheetsRegistry}
				generateClassName={createGenerateClassName()}
				>
				<MuiThemeProvider theme={theme} sheetsManager={new Map()}>
					<NodeJSAppContainer
						location={o.path}
						reducers={o.reducers}
						routerContext={routerContext}>
						{(props) => (
							<WriteInitialState state={props.store.getState()}>
								<App {...props} />
							</WriteInitialState>
						)}
					</NodeJSAppContainer>
				</MuiThemeProvider>
			</JssProvider>
		</ReportChunks>
		</>,
	)
	const jssCss = sheetsRegistry.toString();
	const {
		js,
		styles,
		cssHash,
		stylesheets,
		// scripts
	} = webpackFlushChunks(clientStats, {
		chunkNames,
		outputPath: webpackConfig.output && webpackConfig.output.path,
	});
	const html = htmlElementTemplate({
		head: [
			`<style id="${jssSsrId}">
        ${jssCss}
      </style>`,
			styles,
			stylesheets,
		].join("\n"),
		ssrHtml: appHtml,
		bodyEnd: [cssHash, js].join("\n"),
	});
	const redirect = routerContext.url
		? { url: routerContext.url, status: routerContext.status }
		: undefined
	return { redirect, responseBody: html }
}

export const render = <S, A extends DefaultAction>(o: RenderOptions<S, A>): Middleware => (
	ctx: Context,
	next,
) => {
	const rendered: RenderedApp = renderToHtml({
		App: o.App,
		path: ctx.request.url,
		clientStats: o.clientStats,
		webpackConfig: o.webpackConfig,
		reducers: o.reducers,
	})
	if (rendered.redirect) {
		return o.onRedirect(rendered.redirect)(ctx, next)
	}
	ctx.body = rendered.responseBody
};

interface RenderHtmlProps {
	head?: string;
	ssrHtml?: string;
	bodyEnd?: string;
}

export default render;

const main = async () => {
	const { reducers } = await import("../client/reducers")
	const { TypescriptWebStarterApp } = await import("../client/components/apps/TypescriptWebStarterApp")
	try {
		const html = renderToHtml({
			App: TypescriptWebStarterApp,
			path: "/",
			clientStats: await readOrBuildClientStats(clientDev, clientStatsFilename),
			webpackConfig: clientDev,
			reducers,
		})
		log("info", html)
	} catch (error) {
		throw error
	}
}

if (require.main === module) {
	main().catch((e: Error) => { throw e })
}
