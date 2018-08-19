import React from 'react';
import PropTypes from 'prop-types';
import Floor from '../floor/container';
import Elevator from '../elevator/container';

export default class Building extends React.PureComponent {
  static propTypes = {
    floorsCount: PropTypes.number,
    elevatorsCount: PropTypes.number,
    floorHeight: PropTypes.number
  };

  render () {
    const {
      floorsCount,
      elevatorsCount,
      floorHeight
    } = this.props;

    let floors = [];
    let elevators = [];
    for (let index = floorsCount; index > 0; index--) {
      const style = {
        height: floorHeight,
      };

      floors.push(
        <Floor 
          key={index}
          level={index}
          style={style}
          height={floorHeight}
        />
      );
    }

    for (let index = elevatorsCount; index > 0; index--) {
      const style = {
        left: (index - 1)* 100 + 200
      }

      elevators.push(
        <Elevator 
          key={index}
          id={`Elevator-${index}`}
          style={style}
          floorsCount={floorsCount}
          floorHeight={floorHeight}
        />
      )
    }

    return (
      <div className="building">
        {floors}
        {elevators}
      </div>
    );
  }
}
