/**
 * Reducers for ben module.
 * Meant to be used with ../store
 */
import { Reducer } from "redux";
import { actionTypes, TypescriptWebStarterAppAction } from "../actions";
export interface BenState {
	message: string;
}

export const defaultState: BenState = {
	message: "",
};

export const reducer: Reducer<BenState, TypescriptWebStarterAppAction> = (
	state = defaultState,
	action,
) => {
	switch (action.type) {
		case actionTypes.SetBenMessageAction:
			return { ...state, message: action.payload.message };
		default:
			return state;
	}
};
