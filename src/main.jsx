import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import getStore from './store';
import App from './app';

class Root extends React.PureComponent {
  render () {
    return (
      <Provider store={getStore()}>
        <App />
      </Provider>
    );
  }
}

ReactDOM.render(<Root/>, document.getElementById('main'));
