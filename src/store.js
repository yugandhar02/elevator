import { createStore, applyMiddleware } from 'redux';
import reducer from './reducer';

let store;

export default function getStore() {
    if (!store) {
        store = createStore(reducer);
        window.store = store;
    }

    return store;
}
