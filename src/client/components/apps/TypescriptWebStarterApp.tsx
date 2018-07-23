import { CssBaseline } from "@material-ui/core";
import * as assert from "assert";
import { createMemoryHistory, History } from "history";
import * as React from "react";
import { connect, Provider } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router";
import {
	renderRoutes,
	RouteConfig,
	RouteConfigComponentProps,
} from "react-router-config";
import { Store } from "redux";
import { cli } from "../../../cli";
import TestPage from "../../../client/components/pages/TestPage";
import { NotFoundError } from "../../../errors";
import { things } from "../../../etc/things";
import { reducers, RootState } from "../../reducers";
import { mainStore } from "../../store";
import { AppBarContents, AppBarWithMenu } from "../AppBar";
import { ErrorBoundary } from "../ErrorBoundary";
import { DebugPage } from "../pages/DebugPage";
import { ErrorPage } from "../pages/ErrorPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ThingDetailPage } from "../pages/ThingDetailPage";
import { ThingsIndexPage } from "../pages/ThingsIndexPage";
import { WishlistPage } from "../pages/WishlistPage";

/**
 * Component that wraps all Pages in TypescriptWebStarterApp app.
 * * normalize CSS and set CSS baseline
 * * render an AppBar across top of screen, with menu and such
 * * cathch unexpected errors and render an error message
 * * render child components based on the route prop from react-router
 */
const TypescriptWebStarterAppRoot = ({ route }: RouteConfigComponentProps<{}>) => {
	return (
		<>
			<CssBaseline />
			<AppBarWithMenu title="typescript-web-starter" />
			<AppBarContents>
				<ErrorBoundary>
					{error => {
						if (!error) {
							return route && renderRoutes(route.routes);
						}
						if (error instanceof NotFoundError) {
							return <NotFoundPage />;
						}
						return <ErrorPage error={error} />;
					}}
				</ErrorBoundary>
			</AppBarContents>
		</>
	);
};

/**
 * Lookup an app, given a query from the URL. This one just loads from an in-memory list.
 * Future versions should read from localStorage, an API, or a database.
 * @param appQuery - substring of url that is getting a single app
 */
const fetchThing = (appQuery: string) => {
	const matches = things.filter(
		app => app.slug.toLowerCase() === appQuery.toLowerCase(),
	);
	if (!matches.length) {
		throw new NotFoundError();
	}
	assert.equal(matches.length, 1);
	return matches[0];
};

/**
 * Create an object representing routes for the TypescriptWebStarterApp app
 */
const routeConfig = (): RouteConfig => {
	return {
		component: TypescriptWebStarterAppRoot,
		routes: [
			{ path: "/", exact: true, component: () => <Redirect to="/things" /> },
			{ path: "/debug", exact: true, component: DebugPage },
			{ path: "/test", exact: true, component: TestPage },
			{ path: "/things", exact: true, component: ThingsIndexPage },
			{
				path: "/things/:thing",
				exact: true,
				component: (p: RouteComponentProps<{ thing: string }>) => {
					return <ThingDetailPage thing={fetchThing(p.match.params.thing)} />;
				},
			},
			{
				path: "/wishlist",
				exact: true,
				component: connect((state: TypescriptWebStarterAppState) => {
					return state.app.wishlist || {};
				})(WishlistPage),
			},
			{ path: "*", component: NotFoundPage },
		],
	}
}

export interface TypescriptWebStarterAppProps {
	Router: React.ComponentType;
	history: History;
	store: Store<RootState>;
}

export type TypescriptWebStarterAppState = RootState;

/**
 * Main Component for an App users can use to browse Things, manage their wishlist, etc.
 */
export const TypescriptWebStarterApp: React.StatelessComponent<TypescriptWebStarterAppProps> = props => {
	const Router = props.Router;
	return (
		<Provider store={props.store}>
			<Router>{renderRoutes([routeConfig()])}</Router>
		</Provider>
	);
};

/**
 * Run this when executing this file.
 * Will run a <TypescriptWebStarterApp> through common component cli.
 */
export const main = async () => {

	const { store } = mainStore({reducers});
	const { routerWithLocation } = await import("../containers/NodeJSAppContainer")
	await cli(() => (
		<TypescriptWebStarterApp
			Router={routerWithLocation("/wishlist")}
			history={createMemoryHistory()}
			store={store}
		/>
	));
};

if (require.main === module) {
	main().catch((e: Error) => {
		throw e;
	});
}
