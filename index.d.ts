declare module "redux-inject-reducer-and-saga" {
  import { Store, ReducersMapObject, StoreEnhancer } from 'redux'
  import { History } from 'history';
  
  export function configureStore<State>(
    reducers?: ReducersMapObject,
    initialState?: State,
    history?: History,
    middlewares?: StoreEnhancer[]
  ) : Store
}
