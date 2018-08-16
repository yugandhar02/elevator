import * as actions from './actions';
import * as directions from './directions';

export const initialState = {
  boardingRequests: [],
  elevators: {}
};

export default (state = initialState, action) => {
  switch(action.type) {
    case actions.REGISTER_ELEVATOR:
      return handleRegisterElevator(state, action);

    case actions.REQUEST_ELEVATOR:
      return handleRequestElevator(state, action);

    case actions.REQUEST_STOPAGE:
      return handleRequestStopage(state, action);

    default:
      return state;
  }
};

function handleRegisterElevator(state, action) {
  const { elevatorId } = action;

  return updateElevatorState(state, elevatorId, {
    id: elevatorId,
    direction: directions.NONE,
    currentFloor: 0,
    stopages: [],
    requests: [],
  })
}

function handleRequestElevator(state, action) {
  const {
    floorLevel,
    direction
  } = action;

  const existingRequest = state.boardingRequests.find((pendingRequest) => 
    floorLevel === pendingRequest.floorLevel &&
    direction === pendingRequest.direction
  );

  if (existingRequest) {
    return state;
  }

  const boardingRequests = state.boardingRequests.concat({
    floorLevel,
    direction
  });

  const nearestElevator = getNearestElevator(state, floorLevel, direction);
  const newState = addStopage(state, nearestElevator, floorLevel);

  return Object.assign({}, newState, { boardingRequests })
}

function handleRequestStopage(state, action) {
  const {
    elevatorId,
    floorLevel
  } = actions;

  const elevatorState = state.elevators[elevatorId];
  const hasExistingRequest = find(elevatorState.requests, (requestedFloor) => 
    requestedFloor === floorLevel);

  // toggle request
  if (hasExistingRequest) {
    const hasPendingBoardingRequest = state.boardingRequests.find((pendingRequest) => 
      pendingRequest.direction === elevatorState.direction &&
      pendingRequest.floorLevel === floorLevel
    );
    const nextStopages = hasPendingBoardingRequest ? 
      elevatorState.stopages :
      elevatorState.stopages.filter((stopage) => stopage === floorLevel);

    return updateElevatorState(newState, elevatorId, {
      requests: elevatorState.requests.filter((requestedFloor) => requestedFloor === floorLevel),
      stopages: nextStopages,
    })
  }

  const newState = addStopage(state, elevatorId, floorLevel);
  return updateElevatorState(newState, elevatorId, {
    requests: elevatorState.requests.concat(floorLevel)
  })
}

function addStopage(state, elevatorId, floorLevel) {
  const elevatorState = state.elevators[elevatorId];
  if (!elevatorState) {
    return state;
  }

  const {
    currentFloor,
    direction,
    stopages
  } = elevatorState;

  const isAlreadyExists = stopages.find((stopage) => stopage === floorLevel)
  
  if (isAlreadyExists ||
    currentFloor === floorLevel || (
    direction === directions.UP && currentFloor > floorLevel) || (
    direction === directions.DOWN && currentFloor < floorLevel)) {
      return state;
  }

  let nextDirection = direction;
  if (stopages.length === 0) {
    nextDirection = currentFloor > floorLevel ? directions.DOWN : directions.UP;
  }

  const nextStopages = stopages.concat(floorLevel);
  const nextElevatorState = Object.assign({}, elevatorState, {
    direction: nextDirection,
    stopages: nextStopages.sort(() => {
      if (direction === directions.UP) {
        return -1;
      }

      return 1;
    })
  });

  return updateElevatorState(state, elevatorId, nextElevatorState);
}

function getNearestElevator(state, floorLevel, direction) {
  const elevators = state.elevators;
  const elevatorsIds = Object.keys(elevators);
  let minDist = Number.POSITIVE_INFINITY;
  let nearestElevatorId;

  elevatorsIds.forEach((elevatorId) => {
    const elevatorState = elevators[elevatorId];

    if ((elevatorState.direction === direction || elevatorState.direction === directions.NONE) &&
      minDist > Math.abs(elevatorState.currentFloor - floorLevel)) {

        minDist = Math.abs(elevatorState.currentFloor - floorLevel);
        nearestElevatorId = elevatorId;
      }
  })
  
  return nearestElevatorId;
}

function updateElevatorState(state, elevatorId, elevatorState) {
  return Object.assign({}, state, {
    elevators: Object.assign({}, state.elevators, {
      [elevatorId]: elevatorState
    })
  })
}