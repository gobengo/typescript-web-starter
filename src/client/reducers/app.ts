/**
 * Reducers for app
 */
import { Reducer } from "redux";
import { defaultFilters } from "../../shared";
import { TypescriptWebStarterAppAction } from "../actions";
import { AppState } from "./interfaces";

export const defaultAppState: AppState = {
	wishlist: {
		items: [],
	},
	filters: defaultFilters,
	matches: [],
	ui: {
		isLoading: false,
	},
};

const app: Reducer<AppState, TypescriptWebStarterAppAction> = (
	state = defaultAppState,
	action,
) => {
	return state;
};

export default app;
