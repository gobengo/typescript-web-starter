/**
 * Model the filters that the user can set in the App
 */
export interface FilterRange {
	gte?: number;
	lte?: number;
}

export interface AppFilters {
	age: FilterRange;
	height: FilterRange;
	maxDistance?: FilterRange;
	hasPhoto: boolean;
	compatibilityScore: FilterRange;
	inContact: boolean;
	isFavourite: boolean;
}

import {
	MAX_COMPATIBILITY_SCORE,
	MAX_DISTANCE_DEFAULT,
	MIN_AGE,
	MIN_COMPATIBILITY_SCORE,
	MIN_HEIGHT,
} from "./constants";

export const defaultFilters: AppFilters = {
	age: {
		gte: MIN_AGE,
	},
	height: {
		gte: MIN_HEIGHT,
	},
	maxDistance: {
		lte: MAX_DISTANCE_DEFAULT,
	},
	hasPhoto: false,
	inContact: false,
	isFavourite: false,
	compatibilityScore: {
		gte: MIN_COMPATIBILITY_SCORE,
		lte: MAX_COMPATIBILITY_SCORE,
	},
};
