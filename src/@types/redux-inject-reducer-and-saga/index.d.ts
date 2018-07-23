declare module "redux-inject-reducer-and-saga" {
	import { Store, ReducersMapObject, StoreEnhancer, Middleware } from "redux";
	import { History } from "history";

	export function configureStore<State>(
		reducers?: ReducersMapObject,
		initialState?: State,
		history?: History,
		middlewares?: Middleware[],
	): Store;
}
