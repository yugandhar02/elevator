export const REQUEST_ELEVATOR = 'request_elevator';
export const REGISTER_ELEVATOR = 'register_elevator';
export const REQUEST_STOPAGE = 'request_stopage';
export const UPDATE_CURRENT_FLOOR = 'update_current_floor';
export const CLOSE_DOOR = 'close_door';

export function requestElevator(floorLevel, direction) {
  return {
    type: REQUEST_ELEVATOR,
    floorLevel,
    direction
  };
}

export function requestStopage(elevatorId, floorLevel) {
  return {
    type: REQUEST_STOPAGE,
    elevatorId,
    floorLevel
  };
}

export function registerElevator(id) {
  return {
    type: REGISTER_ELEVATOR,
    elevatorId: id
  }
}

export function updateCurrentFloor(id, currentFloor) {
  return {
    type: UPDATE_CURRENT_FLOOR,
    elevatorId: id,
    currentFloor
  }
}

export function closeDoorWithSomeDelay(id, timeToCloseDoor) {
  return function (dispatch) {
    setTimeout(() => {
      dispatch({
        type: CLOSE_DOOR,
        elevatorId: id
      });
    }, timeToCloseDoor);
  }
}
