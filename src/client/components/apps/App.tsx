/**
 * Interfaces for 'App' components as used in this repo.
 */
import { History } from 'history';
import { Action, Store } from "redux"

export interface AppProps<StoreType> {
	Router: React.ComponentType;
	history: History;
	store: StoreType;
}

export type AppType<S, A extends Action> = React.ComponentType<AppProps<Store<S, A>>>
