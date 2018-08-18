import React from 'react';
import PropTypes from 'prop-types';
import * as directions from '../directions';
import FloorButton from './floorButton';

class Floor extends React.PureComponent {
  static propTypes = {
    level: PropTypes.number,
    height: PropTypes.number,
    boardingRequests: PropTypes.array,
    onElevatorRequest: PropTypes.func
  }

  render () {
    const {
      style,
      level,
      boardingRequests,
      onElevatorRequest
    } = this.props;

    return (
        <div className='building__floor' style={style}>
            <div className='building__floor-header'>
              <span> Floor No. {level}</span>
            </div>
            <div className='building__floor-button-panel'>
              <FloorButton
                level={level}
                direction={directions.UP}
                boardingRequests={boardingRequests}
                onClick={onElevatorRequest}
              />
              <FloorButton
                level={level}
                direction={directions.DOWN}
                boardingRequests={boardingRequests}
                onClick={onElevatorRequest}
              />
            </div>
        </div>
    );
  }
}

export default Floor;
