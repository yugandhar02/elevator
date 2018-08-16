import React from 'react';
import { connect } from 'react-redux';
import Building from './building/building';

class App extends React.PureComponent {
  render () {
    return (
      <div style={{width: "800px"}}>
        <Building
          floorHeight={100}
          floorsCount={8}
        />
      </div>
    );
  }
}

export default App;
