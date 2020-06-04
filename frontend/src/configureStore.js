import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createBrowserHistory } from 'history';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import rootReducer from './redux/reducers';
import sagas from './redux/saga';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const history = createBrowserHistory();
const devToolsOptions = {};
const composeEnhancers = composeWithDevTools(devToolsOptions);

const sagaMiddleware = createSagaMiddleware();

const middleware = [routerMiddleware(history), sagaMiddleware];

const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(...middleware)),
);

sagaMiddleware.run(sagas);

export const persistor = persistStore(store);

export default store;
