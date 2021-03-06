import React from 'react';
import PropTypes from 'prop-types';
import * as directions from '../directions';
import ElevatorButton from './elevatorButton';

const timeToCloseDoor = 1000;

export default class Elevator extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string,
    floorsCount: PropTypes.number,
    floorHeight: PropTypes.number,
    elevatorState: PropTypes.object,
    onRegisterElevator: PropTypes.func,
    onElevatorButtonClick: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      bottom: 0
    }
    this.motionTimerId = null;
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  componentWillMount() {
    const {
      id,
      onRegisterElevator
    } = this.props;

    onRegisterElevator(id);
  }

  componentWillReceiveProps(nextProps) {
    const { 
      id,
      floorHeight,
      elevatorState: {
        nextStop,
        isMoving,
        shouldOpenDoor
      },
      onCloseDoorWithSomeDelay
    } = this.props;

    // If we have received requests the go to that floor
    if (!isMoving && nextProps.elevatorState.isMoving) {
      const nextTargetBottom = (nextProps.elevatorState.nextStop - 1)*floorHeight;
      this.animate(nextTargetBottom);
      return;
    }

    // we have reached destination floor
    if (isMoving && !nextProps.elevatorState.isMoving) {
      window.cancelAnimationFrame(this.motionTimerId);
    }

    // wait for passenger onboarding and close door after that
    // which eventually sets isMoving = true and animation get started again
    if (!shouldOpenDoor && nextProps.elevatorState.shouldOpenDoor) {
      onCloseDoorWithSomeDelay(id, timeToCloseDoor);
      return;
    }

    // we have received a request while moving
    // change the destination floor
    if (nextStop !== nextProps.elevatorState.nextStop) {
      window.cancelAnimationFrame(this.motionTimerId);
      const nextTargetBottom = (nextProps.elevatorState.nextStop - 1)*floorHeight;
      this.animate(nextTargetBottom);
    }
  }

  componentDidUpdate() {
    const {
      id,
      elevatorState: {
        currentFloor,
        direction,
      },
      floorHeight,
      onUpdateCurrentFloor
    } = this.props;

    const { bottom } = this.state;
    const nextFloor = direction === directions.UP ?
      Math.floor(bottom/floorHeight) + 1 :
      Math.ceil(bottom/floorHeight) + 1;
  
    if (currentFloor !== nextFloor) {
      onUpdateCurrentFloor(id, nextFloor);
    }
  }

  handleButtonClick(floorNumber) {
    const {
      id,
      onElevatorButtonClick
    } = this.props;

    onElevatorButtonClick(id, floorNumber);
  }

  animate(targetBottom) {
    const { 
      floorHeight
    } = this.props;
    
    const { bottom } = this.state;
    if (bottom === targetBottom) {
      return;
    }

    this.motionTimerId = window.requestAnimationFrame(() => {
      this.animate(targetBottom);
    });

    const direction = bottom < targetBottom ? 1 : -1;
    this.setState(prevState => ({
      bottom: prevState.bottom + direction * floorHeight/50
    }));
  }

  getStyle() {
    const { style } = this.props;
    const { bottom } = this.state;

    return Object.assign({}, style, {
      bottom
    })
  }

  render () {
    const {
      id,
      floorsCount,
      elevatorState: {
        destinationRequests
      }
    } = this.props;

    const style = this.getStyle();
    let buttons = [];
    for (let index = 1; index <= floorsCount; index++) {
      buttons.push(
        <ElevatorButton
          key={index}
          floorNumber={index}
          destinationRequests={destinationRequests}
          onClick={this.handleButtonClick}
        />
      )
    }

    return (
        <div className='building__elevator' style={style}>
          <div className='building__elevator-header'>{id}</div>
          <div className='building__elevator-control-panel'>
            {buttons}
          </div>
        </div>
    );
  }
}
