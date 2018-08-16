import React from 'react';
import PropTypes from 'prop-types';
import Floor from '../floor/container';
import Elevator from '../elevator/container';

export default class Building extends React.PureComponent {
  static propTypes = {
    floorsCount: PropTypes.number,
    floorHeight: PropTypes.number
  }

  render () {
    const {
      floorsCount,
      floorHeight,
    } = this.props;

    let floors = [];
    for (let index = 0; index < floorsCount; index++) {
      floors.push(
        <Floor 
          key={index}
          level={index}
          height={floorHeight}
        />
      );
    }

    return (
      <div className="building">
        <div className="building__floors">
          {floors}
        </div>
        <div className="building__elevators">
          <Elevator 
            id='test'
            floorsCount={floorsCount}
          />
        </div>
      </div>
    );
  }
}
