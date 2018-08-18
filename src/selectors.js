const defaultElevatorState = {
    stopages: [],
    destinationRequests: []
};
const defaultBoardingRequests = [];

export const getboardingRequests = (state) => state.boardingRequests;
export const getElevatorState = (state, elevatorId) => state.elevators[elevatorId] || defaultElevatorState;
export const getElevatorStopages = (state, elevatorId) => 
    getElevatorState(state, elevatorId).stopages;

export const getElevatorDestinationRequests = (state, elevatorId) => 
    getElevatorState(state, elevatorId).destinationRequests;

export const getboardingRequestsForFloor = (state, floorLevel) => {
    const boardingRequests = getboardingRequests(state);

    return boardingRequests.filter((boardingRequest) => boardingRequest.floorLevel === floorLevel) || defaultBoardingRequests;
}
