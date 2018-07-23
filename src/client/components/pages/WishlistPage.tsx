// import { Typography } from '@material-ui/core';
import * as React from "react";
import { connect, Provider } from "react-redux";
import { Action, bindActionCreators, Dispatch, Reducer, Store } from "redux";
import { configureStore } from "redux-inject-reducer-and-saga";
import { cli } from "../../../cli";
import { things } from "../../../etc/things";

interface WishlistItem {
	name: string;
}

export interface WishlistState {
	items: WishlistItem[];
}

/**
 * Valid values of action.type for actions in WishlistPage
 */
export enum actionTypes {
	LoadRandomWishlistItemsAction = "LoadRandomWishlistItemsAction",
}

type LoadRandomWishlistItemsAction = Action<"LoadRandomWishlistItemsAction">;

type WishlistAction = LoadRandomWishlistItemsAction;

const reducer: Reducer<WishlistState, WishlistAction> = (
	state = {
		items: [],
	},
	action,
) => {
	switch (action.type) {
		case actionTypes.LoadRandomWishlistItemsAction:
			return { ...state, items: things };
		default:
			return state;
	}
};

interface WishlistPageProps {
	items: WishlistItem[];
	loadRandomWishlist(): WishlistAction;
}

/**
 * Page where user can manage their Wishlist of Things
 */
export class WishlistPage extends React.Component<WishlistPageProps> {
	constructor(props: WishlistPageProps) {
		super(props);
	}
	/** render this Component's state/props to React.Node to go in DOM */
	public render(): React.ReactNode {
		const items: WishlistItem[] = things;
		return (
			<>
				<h1>WishlistPage</h1>
				<p>I am a WishlistPage</p>
				<h3>items</h3>
				<ul>
					{items.map(i => {
						return <li key={i.name}>{i.name}</li>;
					})}
				</ul>
			</>
		);
	}
}

const actionCreators = {
	loadRandomWishlist(): LoadRandomWishlistItemsAction {
		return {
			type: actionTypes.LoadRandomWishlistItemsAction,
		};
	},
};

const createConnectedWishlistPage = (prefix: string = "") => {
	const withConnect = connect(
		(state: WishlistState) => {
			return { items: state.items };
		},
		(dispatch: Dispatch) => {
			const props = bindActionCreators(actionCreators, dispatch);
			// get initial data to show off. In the future, we'd fetch from server or localStorage
			props.loadRandomWishlist();
			return props;
		},
	);
	// const withReducer: (c: React.ComponentType): React.ComponentType = injectReducer({reducer});
	return withConnect(props => <WishlistPage {...props} />);
};

export const ConnectedWishlistPage = createConnectedWishlistPage();

const main = async () => {
	const store: Store<WishlistState> = configureStore({ wishlist: reducer });
	store.dispatch(actionCreators.loadRandomWishlist());
	await cli(() => (
		<Provider store={store}>
			<ConnectedWishlistPage />
		</Provider>
	));
};

if (require.main === module) {
	main().catch((error: Error) => {
		throw error;
	});
}
