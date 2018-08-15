export const REQUEST_ELEVATOR = 'request_elevator';
export const REGISTER_ELEVATOR = 'register_elevator';
export const REQUEST_STOPAGE = 'request_stopage';

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
