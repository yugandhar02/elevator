import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';

let store;

export default function getStore() {
  if (!store) {
    store = createStore(reducer, applyMiddleware(thunk));
    window.store = store;
  }

  return store;
}
