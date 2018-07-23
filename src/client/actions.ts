import { ActionCreator } from "redux";
import { AppFilters, Match } from "../shared";

/** typescript type of the 'type' property on Action objects (e.g. { type: "foo" }) */
type ActionTypePropertyType = string;
export interface Action<T extends ActionTypePropertyType> {
	type: T; //tslint:disable-line:no-reserved-keywords
}

export interface ActionWithPayload<T extends ActionTypePropertyType, Payload>
	extends Action<T> {
	payload: Payload;
}

/**
 * Create a new Action with the provided .type and payload type
 */
export function createAction<T extends ActionTypePropertyType>(type: T): Action<T>; //tslint:disable-line:no-reserved-keywords
export function createAction<T extends ActionTypePropertyType, P>(
	type: T, //tslint:disable-line:no-reserved-keywords
	payload: P,
): ActionWithPayload<T, P>;
export function createAction<T extends ActionTypePropertyType, P>(
	type: T, //tslint:disable-line:no-reserved-keywords
	payload?: P,
): Action<T> | ActionWithPayload<T, P> {
	//tslint:disable-line:no-reserved-keywords
	return payload === undefined ? { type } : { type, payload };
}

/**
 * @param A - Type of Actions that can be created
 */
interface ActionCreatorsMapObject<A> {
	[actionCreator: string]: ActionCreator<A>;
}

export type ActionsUnion<
	A,
	ACM extends ActionCreatorsMapObject<A>
> = ReturnType<ACM[keyof ACM]>;

/**
 * Valid values of action.type in Actions we can handle
 */
export enum actionTypes {
	SEARCH_REQUEST_FETCH = "search_request_fetch",
	SEARCH_REQUEST_RECEIVE = "search_request_receive",
	FILTER_CHANGE = "filter_change",
	SetBenMessageAction = "SetBenMessageAction",
}

interface SetBenMessagePayload {
	message: string;
}

const requestSearch = (filters: AppFilters) =>
	createAction(actionTypes.SEARCH_REQUEST_FETCH, filters);
const receiveSearch = (matches: Match[]) =>
	createAction(actionTypes.SEARCH_REQUEST_RECEIVE, matches);
const filterChange = (filters: AppFilters) =>
	createAction(actionTypes.FILTER_CHANGE, filters);
const setBenMessage = (p: SetBenMessagePayload) =>
	createAction(actionTypes.SetBenMessageAction, p);

export const actionCreators = {
	requestSearch,
	receiveSearch,
	filterChange,
	setBenMessage,
};

export type TypescriptWebStarterAppAction =
	| ActionWithPayload<actionTypes.SEARCH_REQUEST_FETCH, AppFilters>
	| ActionWithPayload<actionTypes.SEARCH_REQUEST_RECEIVE, Match[]>
	| ActionWithPayload<actionTypes.FILTER_CHANGE, AppFilters>
	| ActionWithPayload<actionTypes.SetBenMessageAction, SetBenMessagePayload>;
