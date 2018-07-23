/**
 * Store - objects that store all the data for our app components, and handle dispatched actions that change the data
 */
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createMemoryHistory, History } from "history";
import {
	AnyAction,
	applyMiddleware,
	combineReducers,
	compose,
	createStore,
	Middleware,
	Reducer,
	ReducersMapObject,
	Store,
} from "redux";
import { default as createSagaMiddleware, SagaMiddleware } from "redux-saga";
import { default as thunkMiddleware } from "redux-thunk";

declare const module: { hot: any }; // tslint:disable-line:no-reserved-keywords no-any

const configureMiddlewares = (
	oldMiddlewares: Middleware[],
	history?: History,
): Middleware[] => {
	const mw: Middleware[] = [...oldMiddlewares];
	if (history) {
		mw.push(routerMiddleware(history));
	}
	return mw;
};

interface StoreOptions<State, Action extends DefaultAction> {
	history?: History;
	initialState?: State;
	middlewares?: Middleware[];
	reducers: ReducersMapObject<State, Action>; // tslint:disable-line:use-default-type-parameter
}

export type DefaultAction = AnyAction;
export type DefaultState = {};
export type DefaultStore = Store<DefaultState, DefaultAction>

interface MainStoreResult<StoreType> {
	store: StoreType;
}

/**
 * Create a redux Store to hold data for a tree of Components
 */
export const mainStore = <
	StoreState extends DefaultState,
	StoreAction extends DefaultAction,
	SagaContext = {},
>(
	o: StoreOptions<StoreState, StoreAction>,
): MainStoreResult<Store<StoreState, StoreAction>> => {
	const history = o.history;
	const result = injectableStore(
		o.reducers,
		o.initialState,
		history,
		configureMiddlewares([], history),
	);
	return {
		store: result.store,
	};
};

export const store = mainStore;

interface StoreWithInjectors<State, Action extends DefaultAction, ThisSagaContext> {
	store: Store<State, Action>;
	runSaga: (SagaMiddleware<ThisSagaContext>)["run"];
	injectedReducers: ReducersMapObject<State, Action>; // tslint:disable-line:use-default-type-parameter
	injectedSagas: any; // tslint:disable-line:no-any
	history: History;
}

/**
 * Build a root reducer for a redux store
 */
function createRootReducer<
	State extends DefaultState,
	ActionType extends DefaultAction
>(
	reducers: ReducersMapObject<State>,
	history: History,
): Reducer<State, ActionType> {
	const combined = combineReducers<State>(reducers);
	return connectRouter(history)<State>(combined);
}

interface DevtoolsExtensionComposeOptions {
	shouldHotReload: boolean;
}

type ReduxDevtoolsExtensionCompose = (
	o: DevtoolsExtensionComposeOptions,
) => typeof compose;

declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: ReduxDevtoolsExtensionCompose;
	}
}

/**
 * Create a redux store where sagas/reducers can be injected after time of creation
 */
function injectableStore<
	StoreState extends DefaultState,
	StoreAction extends DefaultAction,
	StoreType extends Store<StoreState, StoreAction>,
	SagaContext = {},
>(
	reducers: ReducersMapObject<StoreState, StoreAction>,
	initialState?: StoreState,
	history: History = createMemoryHistory(),
	middlewares: Middleware[] = [],
): StoreWithInjectors<StoreState, StoreAction, SagaContext> {
	// Create the store with 3 middlewares
	// 1. sagaMiddleware: Makes redux-sagas work
	// 2. thunkMiddleware: Makes redux-thunk work
	const sagaMiddleware = createSagaMiddleware();
	const middlewaresToApply = [sagaMiddleware, thunkMiddleware, ...middlewares];
	const enhancers = [applyMiddleware(...middlewaresToApply)];
	// If Redux DevTools Extension is installed use it, otherwise use Redux compose
	const composeEnhancers: typeof compose =
		typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
			? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
					// Try to remove when `react-router-redux` is out of beta, LOCATION_CHANGE should not be fired more than once after hot reloading
					// Prevent recomputing reducers for `replaceReducer`
					shouldHotReload: false,
			  })
			: compose;

	const rootReducer = createRootReducer(reducers, history);
	const regularStore: Store<StoreState, StoreAction> = createStore(
		rootReducer,
		initialState || {},
		composeEnhancers(...enhancers),
	);
	const s: StoreWithInjectors<StoreState, StoreAction, SagaContext> = {
		store: regularStore,
		runSaga: sagaMiddleware.run,
		injectedReducers: reducers,
		injectedSagas: {},
		history,
	};

	return s;
}

import { log } from "../../log";

const main = async () => {
	const { reducers } = await import('../reducers')
	const { store: s } = mainStore({ reducers });
	log("info", s.getState());
};

if (require.main === module) {
	main().catch(error => {
		throw error;
	});
}
