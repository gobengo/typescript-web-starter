/**
 * Component that will load in a node.js process, create some required objects, and hand them down to child apps.
 */
import { createMemoryHistory, History } from 'history';
import * as React from "react"
import { StaticRouterContext } from 'react-router';
import { StaticRouter } from 'react-router-dom';
import { ReducersMapObject, Store } from 'redux';
import { DefaultAction, DefaultState, mainStore } from '../../store';

export interface AppProps<StoreType> {
	Router: React.ComponentType;
	history: History;
	store: StoreType;
}

interface NodeJSAppContainerProps
<
  StoreState extends DefaultState,
  StoreAction extends DefaultAction,
  StoreType extends Store<StoreState, StoreAction>
> {
  children: React.ComponentType<AppProps<StoreType>>
  reducers: ReducersMapObject<StoreState, StoreAction>;
  routerContext: StaticRouterContext;
  location: string;
}

interface NodeJSAppContainerState <StoreType> {
	Router: React.ComponentType;
	history: History;
  store: StoreType;
}

/**
 * Container for Apps that load in the a node.js process.
 * Prepare things that are different in a node.js process (not web browser) and hand them down as props to the provided App component.
 */
export class NodeJSAppContainer
<
  StoreState extends DefaultState,
  StoreAction extends DefaultAction
>
extends React.Component<
NodeJSAppContainerProps<StoreState, StoreAction, Store<StoreState, StoreAction>>,
  NodeJSAppContainerState<Store<StoreState, StoreAction>>
> {
  constructor(props: NodeJSAppContainerProps<StoreState, StoreAction, Store<StoreState, StoreAction>>) {
    super(props)
    this.state = appPropsForNodeJS<StoreState, StoreAction>(props.reducers, props.location, props.routerContext)
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

export const routerWithLocation = (location: string = "/", routerContext: {} = {}) => {
  return (props: { children?: React.ReactNode }) => (
    <StaticRouter location={location} context={routerContext}>
      {props.children}
    </StaticRouter>
  );
};

/**
 * Prepare brwoser-specific props to render with an App Component
 */
function appPropsForNodeJS<
  StoreState extends DefaultState,
  StoreAction extends DefaultAction,
>
(
  reducers: ReducersMapObject<StoreState, StoreAction>,
  location: string,
  routerContext: StaticRouterContext,
  initialState?: StoreState,
)
: AppProps<Store<StoreState, StoreAction>>
{
  const history = createMemoryHistory({ initialEntries: [location] })
  const { store } = mainStore({
    reducers,
    initialState,
    history,
    middlewares: [],
  })
  return {
    history,
    Router: routerWithLocation(location, routerContext),
    store,
  }
}

const main = async () => {
  const { TypescriptWebStarterApp } = await import("../apps/TypescriptWebStarterApp")
  const { renderToString } = await import("react-dom/server")
  const { reducers } = await import("../../reducers")
  const { log } = await import("../../../log")
  log("info", renderToString(
    <NodeJSAppContainer reducers={reducers} location="/" routerContext={{}}>
      { TypescriptWebStarterApp }
    </NodeJSAppContainer>,
  ))
}

if (require.main === module) {
  main().catch((e: Error) => { throw e })
}
