export const getPendingRequests = (state) => state.pendingRequests;
export const getElevatorState = (state, elevatorId) => state.elevators[elevatorId];
export const getElevatorStopages = (state, elevatorId) => 
    getElevatorState(state, elevatorId).stopages;

export const getElevatorRequests = (state, elevatorId) => 
    getElevatorState(state, elevatorId).requests;

export const getPendingRequestsForFloor = (state, floorLevel) => {
    const pendingRequests = getPendingRequests(state);

    return pendingRequests.find((pendingRequest) => pendingRequest.floorLevel === floorLevel);
}
