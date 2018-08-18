import React from 'react';
import PropTypes from 'prop-types';
import ElevatorButton from './elevatorButton';

const timeToCloseDoor = 200;

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

    if (!isMoving && nextProps.elevatorState.isMoving) {
      const nextTargetBottom = (nextProps.elevatorState.nextStop - 1)*floorHeight;
      this.animate(nextTargetBottom);
      return;
    }

    if (isMoving && !nextProps.elevatorState.isMoving) {
      cancelAnimationFrame(this.motionTimerId);
    }

    if (!shouldOpenDoor && nextProps.elevatorState.shouldOpenDoor) {
      onCloseDoorWithSomeDelay(id, timeToCloseDoor);
      return;
    }

    if (nextStop !== nextProps.elevatorState.nextStop) {
      cancelAnimationFrame(this.motionTimerId);
      const nextTargetBottom = (nextProps.elevatorState.nextStop - 1)*floorHeight;
      this.animate(nextTargetBottom);
    }
  }

  componentDidUpdate() {
    const {
      id,
      elevatorState: {
        currentFloor
      },
      floorHeight,
      onUpdateCurrentFloor
    } = this.props;

    const { bottom } = this.state;
    const nextFloor = Math.floor(bottom/floorHeight) + 1;
  
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

    const direction = bottom < targetBottom ? 1 : -1;
    this.motionTimerId = requestAnimationFrame(() => {
      this.setState(prevState => ({
        bottom: prevState.bottom + direction * floorHeight/50
      }));

      this.animate(targetBottom);
    });
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
