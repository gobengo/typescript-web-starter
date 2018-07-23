/**
 * TypeScript interfaces for dealing with App reducers
 */
import { AppFilters, Match } from "../../shared";
import { WishlistState } from "../components/pages/WishlistPage";
import { BenState } from "./ben";

export interface AppState {
	filters: AppFilters;
	matches: Match[];
	ui: {
		isLoading: boolean;
	};
	wishlist: WishlistState;
}

export interface RootState {
	app: AppState;
	ben: BenState;
}
