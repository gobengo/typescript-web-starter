/**
 * Reducer tools
 */
import { Location } from "history";
import { AppFilters, Match } from "../../shared";
import app from "./app";
import { BenState, reducer as benReducer } from "./ben";
import { AppState, RootState } from "./interfaces";
export * from "./interfaces";

export interface AppState {
	filters: AppFilters;
	matches: Match[];
	ui: {
		isLoading: boolean;
	};
}

export interface RootState {
	router?: {
		location: Location;
	};
	app: AppState;
	ben: BenState;
}

export const reducers = {
	app: app,
	ben: benReducer,
};

export default reducers;
