import React from 'react';
import PropTypes from 'prop-types';
import * as directions from '../directions';
import FloorButton from './floorButton';

class Floor extends React.PureComponent {
  static propTypes = {
    level: PropTypes.number,
    height: PropTypes.number,
    pendingRequest: PropTypes.object,
    onElevatorRequest: PropTypes.func,
  }

  getStyles() {
    const {
      level,
      height,
    } = this.props;

    return {
      bottom: level * height,
      height: height,
    };
  }

  render () {
    const {
      level,
      pendingRequest,
      onElevatorRequest
    } = this.props;

    return (
        <div className="floor" style={this.getStyles()}>
            <div className="floor__level">
              <span> Floor No. {level}</span>
            </div>
            <div className="floor__indicator">
              <FloorButton
                level={level}
                direction={directions.UP}
                pendingRequest={pendingRequest}
                onClick={onElevatorRequest}
              />
              <FloorButton
                level={level}
                direction={directions.DOWN}
                pendingRequest={pendingRequest}
                onClick={onElevatorRequest}
              />
            </div>
        </div>
    );
  }
}

export default Floor;
