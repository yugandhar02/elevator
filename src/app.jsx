import React from 'react';
import Building from './building/building';

class App extends React.PureComponent {
  render () {
    return (
      <div style={{ width: '800px' }}>
        <Building
          floorHeight={200}
          floorsCount={8}
          elevatorsCount={1}
        />
      </div>
    );
  }
}

export default App;
