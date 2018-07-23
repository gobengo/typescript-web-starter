/**
 * Component that will load in the browser, create some required objects, and hand them down to child apps.
 */
import { createBrowserHistory, History } from 'history';
import * as React from "react"
import { BrowserRouter } from 'react-router-dom';
import { ReducersMapObject, Store } from 'redux';
import { DefaultAction, DefaultState, mainStore } from '../../store';

declare global {
	interface Window {
		__INITIAL_STATE__: any; // tslint:disable-line:no-any
	}
}

export const readInitialStateFromGlobal = <State extends DefaultState>(global=window, shouldDelete=true): State|undefined => {
	const initialState = global.__INITIAL_STATE__ as State|undefined;
	if (initialState && shouldDelete) { delete global.__INITIAL_STATE__ } // supposedly allows for garbage collection
	return initialState
}

interface AppProps<StoreType> {
	Router: React.ComponentType;
	history: History;
	store: StoreType;
}

interface BrowserAppContainerProps
<
  StoreState extends DefaultState,
  StoreAction extends DefaultAction,
  StoreType extends Store<StoreState, StoreAction>
> {
  children: React.ComponentType<AppProps<StoreType>>
  reducers: ReducersMapObject<StoreState, StoreAction>;
}

interface BrowserAppContainerState <StoreType> {
	Router: React.ComponentType;
	history: History;
  store: StoreType;
}

/**
 * Container for Apps that load in the browser.
 * Prepare things that are different in browser vs server-side and hand them down as props to the provided App component.
 */
export class BrowserAppContainer
<
  StoreState extends DefaultState,
  StoreAction extends DefaultAction
>
extends React.Component<
BrowserAppContainerProps<StoreState, StoreAction, Store<StoreState, StoreAction>>,
  BrowserAppContainerState<Store<StoreState, StoreAction>>
> {
  constructor(props: BrowserAppContainerProps<StoreState, StoreAction, Store<StoreState, StoreAction>>) {
    super(props)
    const initialState = readInitialStateFromGlobal() as StoreState
    this.state = appPropsForBrowser<StoreState, StoreAction>(props.reducers, initialState)
  }
  /** render Component state + props to ReactNode to be rendered into HTML */
  public render(): React.ReactNode {
    const { children } = this.props
    const App = children;
    const { history, Router, store } = this.state
    return (
      <App
        history={history}
        Router={Router}
        store={store}
      />
    )
  }
}

/**
 * Prepare brwoser-specific props to render with an App Component
 */
function appPropsForBrowser<
  StoreState extends DefaultState,
  StoreAction extends DefaultAction,
>
(
  reducers: ReducersMapObject<StoreState, StoreAction>,
  initialState?: StoreState,
)
: AppProps<Store<StoreState, StoreAction>>
{
  const history = createBrowserHistory()
  const created = mainStore({
    reducers,
    initialState,
    history,
    middlewares: [],
  })
  const store: Store<StoreState, StoreAction> = created.store
  return {
    history,
    Router: BrowserRouter,
    store,
  }
}
