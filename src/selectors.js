const defaultElevatorState = {
    stopages: [],
    requests: []
};
const defaultBoardingRequests = [];

export const getboardingRequests = (state) => state.boardingRequests;
export const getElevatorState = (state, elevatorId) => state.elevators[elevatorId] || defaultElevatorState;
export const getElevatorStopages = (state, elevatorId) => 
    getElevatorState(state, elevatorId).stopages;

export const getElevatorRequests = (state, elevatorId) => 
    getElevatorState(state, elevatorId).requests;

export const getboardingRequestsForFloor = (state, floorLevel) => {
    const boardingRequests = getboardingRequests(state);

    return boardingRequests.filter((pendingRequest) => pendingRequest.floorLevel === floorLevel) || defaultBoardingRequests;
}
