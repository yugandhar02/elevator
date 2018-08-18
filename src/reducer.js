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
      return handleBoardingElevator(state, action);

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
    destinationRequests: [],
  })
}

function handleBoardingElevator(state, action) {
  const {
    floorLevel,
    direction
  } = action;

  const existingBoardingRequest = state.boardingRequests.find((boardingRequest) => 
    floorLevel === boardingRequest.floorLevel &&
    direction === boardingRequest.direction
  );

  if (existingBoardingRequest) {
    return state;
  }

  const nextBoardingRequests = state.boardingRequests.concat({
    floorLevel,
    direction
  });

  const nearestElevator = getNearestElevator(state, floorLevel, direction);
  if (!nearestElevator) {
    return Object.assign({}, state, { 
      boardingRequests: nextBoardingRequests
    })
  }

  const newState = addStopage(state, nearestElevator, floorLevel);
  return Object.assign({}, newState, { 
    boardingRequests: nextBoardingRequests
  })
}

function handleRequestStopage(state, action) {
  const {
    elevatorId,
    floorLevel
  } = action;

  const elevatorState = state.elevators[elevatorId];
  if(!elevatorState) {
    return state;
  }

  const hasExistingRequest = elevatorState.destinationRequests.find((requestedFloor) => 
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
      destinationRequests: elevatorState.destinationRequests.filter((requestedFloor) => requestedFloor === floorLevel),
      stopages: nextStopages,
    })
  }

  const newState = addStopage(state, elevatorId, floorLevel);
  return updateElevatorState(newState, elevatorId, {
    destinationRequests: elevatorState.destinationRequests.concat(floorLevel)
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

  return updateElevatorState(state, elevatorId, {
    direction: nextDirection,
    stopages: nextStopages.sort((a, b) => {
      if (direction === directions.UP) {
        return a - b;
      }

      return b - a;
    })
  });
}

function getNearestElevator(state, floorLevel, direction) {
  const elevators = state.elevators;
  const elevatorsIds = Object.keys(elevators);
  let minDist = Number.POSITIVE_INFINITY;
  let nearestElevatorId;

  elevatorsIds.forEach((elevatorId) => {
    const elevatorState = elevators[elevatorId];
    const isGoingUp = elevatorState.direction === directions.UP;
    const lastDestination = isGoingUp ?
      Math.max.apply(null, elevatorState.destinationRequests) :
      Math.min.apply(null, elevatorState.destinationRequests);

    const canGoToFloor = elevatorState.direction === directions.NONE ||
    isGoingUp ? direction === directions.UP && floorLevel < lastDestination : 
    direction === directions.DOWN && floorLevel > lastDestination;

    if (canGoToFloor && minDist > Math.abs(elevatorState.currentFloor - floorLevel)) {
      minDist = Math.abs(elevatorState.currentFloor - floorLevel);
      nearestElevatorId = elevatorId;
    }
  })
  
  return nearestElevatorId;
}

function updateElevatorState(state, elevatorId, elevatorState) {
  const nextElevatorState = Object.assign({}, state.elevators[elevatorId], elevatorState);

  return Object.assign({}, state, {
    elevators: Object.assign({}, state.elevators, {
      [elevatorId]: nextElevatorState
    })
  })
}