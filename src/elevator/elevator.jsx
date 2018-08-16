import React from 'react';
import PropTypes from 'prop-types';
import ElevatorButton from './elevatorButton';

const timeBetweenTwoFloors = 500;

export default class Elevator extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string,
    requests: PropTypes.array,
    onRegisterElevator: PropTypes.func,
    onElevatorButtonClick: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      nextStopage: -1,
    };

    this.motionTimerId = null;
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  componentWillMount() {
    const {
      id,
      onRegisterElevator,
    } = this.props;

    onRegisterElevator(id);
  }

  handleButtonClick(floorNumber) {
    const {
      id,
      onElevatorButtonClick,
    } = this.props;

    onElevatorButtonClick(id, floorNumber);
  }

  getStyle() {
    const { bottom } = this.state;
    return {
      bottom,
    }
  }

  render () {
    const {
      id,
      floorsCount,
      requests,
    } = this.props;

    let buttons = [];
    for (let index = 1; index <= floorsCount; index++) {
      buttons.push(
        <ElevatorButton
          key={index}
          floorNumber={index}
          requests={requests}
          onClick={this.handleButtonClick}
        />
      )
    }

    return (
        <div className="elevator" style={this.getStyle()}>
          <div className="elevator__header">ELEVATOR {id}</div>
          <div className="elevator__control-panel">
            {buttons}
          </div>
        </div>
    );
  }
}
