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

    case actions.UPDATE_CURRENT_FLOOR:
      return handleUpdateCurrentFloor(state, action);

    case actions.CLOSE_DOOR:
      return handleDoorClosing(state, action);

    default:
      return state;
  }
};

function handleRegisterElevator(state, action) {
  const { elevatorId } = action;

  return updateElevatorState(state, elevatorId, {
    id: elevatorId,
    direction: directions.NONE,
    currentFloor: 1,
    destinationRequests: [],
    isMoving: false,
    shouldOpenDoor: false
  });
}

function handleBoardingElevator(state, action) {
  const {
    floorLevel,
    direction
  } = action;

  const existingBoardingRequest = state.boardingRequests.find(boardingRequest => 
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

  const nearestIdleElevator = getNearestIdleElevator(state, floorLevel);
  if (!nearestIdleElevator) {
    return Object.assign({}, state, { 
      boardingRequests: nextBoardingRequests
    });
  }

  if (nearestIdleElevator.currentFloor === floorLevel) {
    return state;
  }

  // set the direction and nextStop
  const newState = updateElevatorState(state, nearestIdleElevator.id, {
    direction: floorLevel > nearestIdleElevator.currentFloor ?
      directions.UP :
      directions.DOWN,
    
    nextStop: floorLevel,
    isMoving: true
  })
  
  return Object.assign({}, newState, { 
    boardingRequests: nextBoardingRequests
  });
}

function handleRequestStopage(state, action) {
  const {
    elevatorId,
    floorLevel
  } = action;

  const elevatorState = state.elevators[elevatorId];
  if (!elevatorState) {
    return state;
  }

  if (!canGoToFloor(elevatorState, floorLevel)) {
    return state;
  }

  const {
    destinationRequests,
    direction,
    currentFloor,
    nextStop
  } = elevatorState;

  const nextDestinationRequests= destinationRequests.filter(requestedFloor => 
  requestedFloor !== floorLevel);

  // toggle request if it already exists
  if (nextDestinationRequests.length !== destinationRequests.length) {
    return updateElevatorState(state, elevatorId, {
      destinationRequests: nextDestinationRequests
    })
  }

  let nextDirection = direction;
  let nextStopage = nextStop;

  // set the direction and nextStop if the elevator was idle
  if (direction === directions.NONE) {
    nextDirection = floorLevel > currentFloor ?
      directions.UP :
      directions.DOWN;
    
    nextStopage = floorLevel;
  }

  return updateElevatorState(state, elevatorId, {
    destinationRequests: destinationRequests.concat(floorLevel),
    direction: nextDirection,
    nextStop: nextStopage,
    isMoving: true
  })
}

function handleUpdateCurrentFloor(state, action) {
  const {
    elevatorId,
    currentFloor
  } = action;

  const elevatorState = state.elevators[elevatorId];
  if (!elevatorState) {
    return state;
  }

  const {
    destinationRequests,
    direction
  } = elevatorState;

  const nextDestinationRequests = destinationRequests.filter(destinationRequest => 
    destinationRequest !== currentFloor);

  let nextBoardingRequests = state.boardingRequests.filter(boardingRequest =>
    boardingRequest.floorLevel !== currentFloor ||
    boardingRequest.direction !== direction);

  const shouldOpenDoor = nextDestinationRequests.length !== destinationRequests.length ||
    nextBoardingRequests.length !== state.boardingRequests.length;

  let newState = state;
  if (nextBoardingRequests.length === 0 &&
    nextDestinationRequests.length === 0) {

    newState = updateElevatorState(state, elevatorId, {
      currentFloor,
      nextStop: currentFloor,
      destinationRequests: nextDestinationRequests,
      direction: directions.NONE,
      isMoving: false
    });
  } else if (nextDestinationRequests.length === 0) {
    const nextElevatorState = {
      direction,
      currentFloor
    }

    const nearestFloor = getNearestOnboardingFloor(nextBoardingRequests, nextElevatorState);

    let nextDirection = direction;
    if (nearestFloor === currentFloor) {
      nextBoardingRequests = nextBoardingRequests.filter((request) =>
        request.floorLevel !== currentFloor);

      nextDirection = directions.NONE;
    } else if (nearestFloor > currentFloor) {
      nextDirection = directions.UP
    } else {
      nextDirection = directions.DOWN
    }

    newState = updateElevatorState(state, elevatorId, {
      currentFloor,
      direction: nextDirection,
      nextStop: nearestFloor,
      destinationRequests: nextDestinationRequests,
      isMoving: !shouldOpenDoor,
      shouldOpenDoor
    });
  } else {
    const nearestDestination = getNearestDestination(elevatorState, destinationRequests);
    const nearestIntermediateBoardingReq = getNearestIntermediateBoardingRequest(nextBoardingRequests, elevatorState, nearestDestination);
    let nextStop = nearestDestination;
    
    if (nearestIntermediateBoardingReq !== -1) {
      nextStop = nearestIntermediateBoardingReq;
    }

    newState = updateElevatorState(state, elevatorId, {
      currentFloor,
      destinationRequests: nextDestinationRequests,
      nextStop,
      shouldOpenDoor,
      isMoving: !shouldOpenDoor
    });
  }

  return Object.assign({}, newState, {
    boardingRequests: nextBoardingRequests
  });
}

function handleDoorClosing(state, action) {
  const { elevatorId } = action;

  return updateElevatorState(state, elevatorId, {
    shouldOpenDoor: false,
    isMoving: true
  });
}

function updateElevatorState(state, elevatorId, elevatorState) {
  const nextElevatorState = Object.assign({}, state.elevators[elevatorId], elevatorState);

  return Object.assign({}, state, {
    elevators: Object.assign({}, state.elevators, {
      [elevatorId]: nextElevatorState
    })
  })
}

function getNearestIdleElevator(state, floorLevel) {
  const elevators = state.elevators;
  const elevatorsIds = Object.keys(elevators);
  let minDist = Number.POSITIVE_INFINITY;
  let nearestElevatorId;

  elevatorsIds.forEach(elevatorId => {
    const elevatorState = elevators[elevatorId];
    const {
      currentFloor,
      direction
    } = elevatorState;

    const isIdle = direction === directions.NONE;
    const distance = Math.abs(currentFloor - floorLevel);

    if (isIdle && minDist > distance) {
      minDist = distance;
      nearestElevatorId = elevatorId;
    }
  })
  
  return elevators[nearestElevatorId] || null;
}

function canGoToFloor(elevatorState, floor) {
  const {
    direction,
    currentFloor
  } = elevatorState;

  if (direction === directions.UP) {
    return floor > currentFloor;
  }

  if (direction === directions.DOWN) {
    return floor < currentFloor;
  }
  
  // idle elevator can go to any floor except same
  return currentFloor !== floor;
}

function getNearestOnboardingFloor(boardingRequests, elevatorState) {
  const { direction } = elevatorState;
  const floorsToVisitInSameDirection = boardingRequests.filter(request =>
    canGoToFloor(elevatorState, request.floorLevel));

  if (floorsToVisitInSameDirection.length > 0) {
    const floorsWithSameRequestDirection = floorsToVisitInSameDirection.filter(request =>
      request.direction === direction);

    if (floorsWithSameRequestDirection.length > 0) {
      const floors = floorsWithSameRequestDirection.map(request => request.floorLevel);
      return getNearestDestination(elevatorState, floors);
    }

    const floorsWithOppRequestDirection = floorsToVisitInSameDirection.filter(request =>
      request.direction !== direction && direction !== directions.NONE);

    if (floorsWithOppRequestDirection.length > 0) {
      const floors = floorsWithOppRequestDirection.map(request => request.floorLevel);
      return getNearestDestination(elevatorState, floors);
    }
  }

  const updatedElevatorState = Object.assign({}, elevatorState, {
    direction: direction === directions.UP ?
      directions.DOWN :
      directions.UP
  });

  const floorsWithSameRequestDirection = boardingRequests.filter(request =>
    request.direction === updatedElevatorState.direction);

  if (floorsWithSameRequestDirection.length > 0) {
    const floors = floorsWithSameRequestDirection.map(request => request.floorLevel);
    return getNearestDestination(updatedElevatorState, floors);
  }

  const floorsWithOppRequestDirection = boardingRequests.filter(request =>
      request.direction !== direction);

  if (floorsWithOppRequestDirection.length > 0) {
    const floors = floorsWithOppRequestDirection.map(request => request.floorLevel);
    return getNearestDestination(updatedElevatorState, floors);
  }
}

function getNearestDestination(elevatorState, destinationRequests) {
  const {
    direction
  } = elevatorState;

  if (destinationRequests.length === 0) {
    return -1;
  }

  if (direction === directions.UP) {
    return Math.min.apply(null, destinationRequests);
  }

  if (direction === directions.DOWN) {
    return Math.max.apply(null, destinationRequests);
  }

  return destinationRequests[0];
}

function getNearestIntermediateBoardingRequest(boardingRequests, elevatorState, destination) {
  const {
    currentFloor,
    direction
  } = elevatorState;

  const intermediateBoardingRequests = boardingRequests.filter(request => 
    request.direction === direction && 
    request.floorLevel > currentFloor &&
    request.floorLevel < destination);

  const floors = intermediateBoardingRequests.map(request => request.floorLevel);
  return getNearestDestination(elevatorState, floors);
}