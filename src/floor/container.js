import { connect } from 'react-redux';
import * as selectors from '../selectors';
import * as actions from '../actions';
import Floor from './floor';

const mapStateToProps = (state, ownProps) => ({
    pendingRequest: selectors.getboardingRequestsForFloor(state, ownProps.level)
});

const mapDispatchToProps = {
    onElevatorRequest: actions.requestElevator,
}

export default connect(mapStateToProps, mapDispatchToProps)(Floor);