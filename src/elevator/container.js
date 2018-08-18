import { connect } from 'react-redux';
import * as selectors from '../selectors';
import * as actions from '../actions';
import Elevator from './elevator';

const mapStateToProps = (state, ownProps) => ({
    elevatorState: selectors.getElevatorState(state, ownProps.id),
});

const mapDispatchToProps = {
    onRegisterElevator: actions.registerElevator,
    onElevatorButtonClick: actions.requestStopage,
    onUpdateCurrentFloor: actions.updateCurrentFloor,
    onCloseDoorWithSomeDelay: actions.closeDoorWithSomeDelay
}

export default connect(mapStateToProps, mapDispatchToProps)(Elevator);