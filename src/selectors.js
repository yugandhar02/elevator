import * as directions from './directions';

const getDefaultElevatorState = id => ({
  id,
  direction: directions.NONE,
  currentFloor: 1,
  destinationRequests: [],
  isMoving: false,
  shouldOpenDoor: false
});
const defaultBoardingRequests = [];

export const getboardingRequests = state => state.boardingRequests;
export const getElevatorState = (state, elevatorId) => state.elevators[elevatorId] || getDefaultElevatorState(elevatorId);

export const getboardingRequestsForFloor = (state, floorLevel) => {
  const boardingRequests = getboardingRequests(state);

  return boardingRequests.filter(boardingRequest => boardingRequest.floorLevel === floorLevel) || defaultBoardingRequests;
}
