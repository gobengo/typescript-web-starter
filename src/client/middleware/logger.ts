/**
 * Redux middleware to log all actions
 */
import { Action, Middleware, Store } from "redux";
import { log } from "../../log";

export const logger: Middleware = <S, A extends Action>(store: Store<S, A>) => {
	return next => (action: Action) => {
		log("info", "[redux logger]", action);
		return next(action);
	};
};
