import { connect } from 'react-redux';
import * as selectors from '../selectors';
import * as actions from '../actions';
import Elevator from './elevator';

const mapStateToProps = (state, ownProps) => ({
    destinationRequests: selectors.getElevatorDestinationRequests(state, ownProps.id)
});

const mapDispatchToProps = {
    onRegisterElevator: actions.registerElevator,
    onElevatorButtonClick: actions.requestStopage,
}

export default connect(mapStateToProps, mapDispatchToProps)(Elevator);