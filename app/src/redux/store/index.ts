import { applyMiddleware, createStore } from 'redux';
// import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';

// const loggerMiddleware = createLogger();
const middlewareArray = [thunk]
const middleware = applyMiddleware(...middlewareArray);
const store = createStore(rootReducer, middleware);
export { store };